<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Dotenv\Util\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Container\Attributes\DB;
use Illuminate\Support\Facades\Artisan;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Settings/Settings', [
            'settings' => Setting::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $envFilePath = base_path('.env');
        $envContent = File::get($envFilePath);

        if($request->hasFile('web_icon')) {
            $request->validate([
                'web_icon' => 'mimes:ico|max:2048',
            ]);

            $faviconPath = public_path('favicon.ico');
            if (File::exists($faviconPath)) {
                File::delete($faviconPath);
            }

            $request->file('web_icon')->move( public_path(), 'favicon.ico');
        }

        if(isset($request->web_name)){
            $request->validate([
                'web_name' => 'string',
            ]);
            $envContent = preg_replace("/^VITE_APP_NAME=.*/m", "VITE_APP_NAME='{$request->web_name}'", $envContent);
            File::put($envFilePath, $envContent);
            return redirect()->route('setting.index');
        }

        if(isset($request->web_color)){
            $request->validate([
                'web_color' => 'string',
            ]);

            $envContent = preg_replace("/^VITE_APP_COLOR=.*/m", "VITE_APP_COLOR='{$request->web_color}'", $envContent);
            File::put($envFilePath, $envContent);
            return redirect()->route('setting.index');
        }

        if(isset($request->web_event)){
            $request->validate([
                'web_event' => 'string',
            ]);

            if(isset($request->web_event_link)){
                $request->validate([
                    'web_event_link' => 'url',
                ]);

                $linkValue = [
                    "key" => "web_event_link",
                    "value" => $request->web_event_link,
                    "type" => "link",
                ];

                Setting::upsert($linkValue, ["key"] , ["key", "value", "type"]);
            }
            $eventValue = [
                "key" => "web_event",
                "value" => $request->web_event,
                "type" => "text",
            ];

            Setting::upsert($eventValue, ["key"] , ["key", "value", "type"]);

            return redirect()->route('setting.index');
        }
    }

    public function footerSetting(Request $request)
    {
        if($request->web_footer_desc){
            $request->validate([
                'web_footer_desc' => 'string',
            ]);

            $footerDescValue = [
                "key" => "web_footer_desc",
                "value" => $request->web_footer_desc,
                "type" => "text",
            ];

            Setting::upsert($footerDescValue, ["key"] , ["key", "value", "type"]);
        }

        if($request->web_fb_link){
            $request->validate([
                'web_fb_link' => 'url',
            ]);

            $fbLinkValue = [
                "key" => "web_fb_link",
                "value" => $request->web_fb_link,
                "type" => "link",
            ];

            Setting::upsert($fbLinkValue, ["key"] , ["key", "value", "type"]);
        }

        if($request->web_ig_link){
            $request->validate([
                'web_ig_link' => 'url',
            ]);

            $igLinkValue = [
                "key" => "web_ig_link",
                "value" => $request->web_ig_link,
                "type" => "link",
            ];

            Setting::upsert($igLinkValue, ["key"] , ["key", "value", "type"]);
        }

        if($request->web_tw_link){
            $request->validate([
                'web_tw_link' => 'url',
            ]);

            $twLinkValue = [
                "key" => "web_tw_link",
                "value" => $request->web_tw_link,
                "type" => "link",
            ];

            Setting::upsert($twLinkValue, ["key"] , ["key", "value", "type"]);
        }

        if($request->web_ln_link){
            $request->validate([
                'web_ln_link' => 'url',
            ]);

            $lnLinkValue = [
                "key" => "web_ln_link",
                "value" => $request->web_ln_link,
                "type" => "link",
            ];

            Setting::upsert($lnLinkValue, ["key"] , ["key", "value", "type"]);
        }

        return redirect()->route('setting.index');
    }

    public function carouselSetting(Request $request)
    {
        $request->validate([
            'carousel_image' => 'mimes:jpeg,jpg,png|max:2048',
        ]);

        $fileName = time() . '.' . $request->file('carousel_image')->getClientOriginalExtension();
        $filePath = 'storage/images/carousels/' . $fileName;
        $request->file('carousel_image')->storeAs('images/carousels/', $fileName, 'public');

        Setting::create([
            'key' => 'carousel_image_'.time(),
            'value' => $filePath,
            'type' => 'image',
        ]);

        return redirect()->route('setting.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function deleteEvent(){
        Setting::where("key", "web_event")->delete();
        Setting::where("key", "web_event_link")->delete();
        return redirect()->route('setting.index');
    }

    public function deleteCarousel(string $id){
        $file = Setting::where("key", $id)->first();
        unlink(public_path($file->value));
        $file->delete();
        return redirect()->route('setting.index');
    }

}
