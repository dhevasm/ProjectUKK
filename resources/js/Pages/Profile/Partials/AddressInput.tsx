import React, { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
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

// Fix leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface User {
    id: number;
    name: string;
    email: string;
    image: string;
    phone : string;
    address: string;

}

interface PageProps {
    auth: {
        user: User;
    };
}

interface NominatimResponse {
    display_name: string;
}

interface FormData {
    address: string;
}

export default function AddressInput() {
    const { auth } = usePage<PageProps>().props;
    const [position, setPosition] = useState<LatLngExpression | null>(null);

    const { data, setData, patch, errors, processing } = useForm<FormData>({
        address: auth.user.address
    });

    useEffect(() => {
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
    }, []);

    const updateAddress = async (lat: number, lng: number): Promise<void> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data: NominatimResponse = await response.json();
            setData('address', data.display_name);
        } catch (error) {
            toast.error('Gagal mendapatkan alamat');
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
            <div>
                <InputLabel htmlFor="address" value="Address" />
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

            <Button variant={'theme'} type="submit" disabled={processing}>
                {processing ? "Menyimpan..." : "Simpan Alamat"}
            </Button>
        </form>
    );
}
