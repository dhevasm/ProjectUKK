import React, { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { FormEventHandler } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LatLngExpression, LeafletEvent, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Search } from 'lucide-react';
import { User } from '@/types';

// Fix leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PageProps {
    auth: {
        user: User;
    };
}

interface NominatimResponse {
    display_name: string;
    lat?: string;
    lon?: string;
}

interface FormData {
    address: string;
    coordinates: string;
    searchQuery: string;
}

export default function AddressInput() {
    const { auth } = usePage<PageProps>().props;
    const [position, setPosition] = useState<LatLngExpression | null>(null);
    const [map, setMap] = useState<L.Map | null>(null);
    const [searchResults, setSearchResults] = useState<NominatimResponse[]>([]);
    const [showRecommendations, setShowRecommendations] = useState(false);

    const { data, setData, patch, errors, processing } = useForm<FormData>({
        address: auth.user.address,
        coordinates: auth.user.coordinates || '',
        searchQuery: ''
    });

    const MyLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos: GeolocationPosition) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
                updateAddress(pos.coords.latitude, pos.coords.longitude);
            },
            () => {
                // Default to Jakarta if geolocation fails
                setPosition([-6.200000, 106.816666]);
                updateAddress(-6.200000, 106.816666);
            }
        );
    }

    useEffect(() => {
        if (auth.user.coordinates) {
            const [lat, lng] = auth.user.coordinates.split(',').map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
                setPosition([lat, lng]);
                return;
            }
        }

        MyLocation();
    }, []);

    const updateAddress = async (lat: number, lng: number): Promise<void> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data: NominatimResponse = await response.json();
            setData(prev => ({
                ...prev,
                address: data.display_name,
                coordinates: `${lat},${lng}`
            }));
        } catch (error) {
            toast.error('Gagal mendapatkan alamat');
        }
    };

    const searchLocation = async () => {
        if (!data.searchQuery.trim()) {
            toast.error('Masukkan nama lokasi untuk mencari');
            return;
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.searchQuery)}&limit=5`
            );
            const results: NominatimResponse[] = await response.json();

            if (results.length === 0) {
                toast.error('Lokasi tidak ditemukan');
                setSearchResults([]);
                return;
            }

            setSearchResults(results);
            setShowRecommendations(true);
        } catch (error) {
            toast.error('Gagal mencari lokasi');
        }
    };

    const selectLocation = (result: NominatimResponse) => {
        if (result.lat && result.lon) {
            const latNum = parseFloat(result.lat);
            const lonNum = parseFloat(result.lon);
            setPosition([latNum, lonNum]);
            setData(prev => ({
                ...prev,
                address: result.display_name,
                coordinates: `${latNum},${lonNum}`,
                searchQuery: ''
            }));

            if (map) {
                map.setView([latNum, lonNum], 13);
            }
            setShowRecommendations(false);
            setSearchResults([]);
            toast.success('Lokasi ditemukan');
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.address'), {
            preserveScroll: true,
            onSuccess: () => toast.success('Alamat berhasil diperbarui'),
            onError: () => toast.error('Gagal memperbarui alamat')
        });
    };

    if (!position) return null;

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="relative">
                <div className="flex gap-2">
                    <div className="flex-1">
                        <InputLabel htmlFor="searchQuery" value="Cari Lokasi" />
                        <TextInput
                            id="searchQuery"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setData('searchQuery', e.target.value);
                                setShowRecommendations(false);
                            }}
                            placeholder="Masukkan nama lokasi..."
                        />
                    </div>
                    <div className="flex items-end ">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={searchLocation}
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Cari
                        </Button>
                    </div>
                </div>

                {showRecommendations && searchResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border">
                        <ul className="py-1">
                            {searchResults.map((result, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={() => selectLocation(result)}
                                >
                                    {result.display_name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div>
                <div className='flex justify-between'>
                <InputLabel htmlFor="address" value="Address" />
                {
                    auth.user.address == null && <p className="text-sm text-red-500">Alamat belum disimpan</p>
                }
                </div>
                <TextInput
                    id="address"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setData('address', e.target.value)
                    }
                    required
                />
                <InputError message={errors.address} className="mt-2" />
            </div>



            <div className="h-64 w-full rounded-lg overflow-hidden">
                <MapContainer
                    center={position}
                    zoom={13}
                    className="h-full w-full z-0"
                    ref={setMap}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                        position={position}
                        draggable={true}
                        eventHandlers={{
                            dragend: (e: LeafletEvent) => {
                                const marker = e.target;
                                const pos = marker.getLatLng();
                                setPosition([pos.lat, pos.lng]);
                                updateAddress(pos.lat, pos.lng);
                            },
                        }}
                    />
                </MapContainer>
            </div>

            <div className='flex justify-between items-end'>
                <Button variant={'theme'} type="submit" disabled={processing}>
                    {processing ? "Menyimpan..." : "Simpan"}
                </Button>

                <div className='flex gap-2 items-end'>
                <Button onClick={MyLocation} type='reset' variant={"outline"}>
                    <MapPin className="w-4 h-4 mr-2" />
                    Lokasi Saat Ini
                </Button>
                <div className='hidden'>
                <InputLabel htmlFor="coordinates" value="Coordinates"  />
                <TextInput
                    id="coordinates"
                    type="text"
                    className="mt-1 block w-full bg-gray-50"
                    value={data.coordinates}
                    readOnly
                />
                <InputError message={errors.coordinates} className="mt-2" />
                </div>
            </div>
            </div>
        </form>
    );
}
