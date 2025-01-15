<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AsistenManagerController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        $user = Auth::user();
        $roles = session('selected_role', 'default');
 
        return Inertia::render('AsistenManager/dashboard',[
         'user' => $user,
         'roles' => $roles
        ]);
    }

    // Show the form for creating a new resource
    public function create()
    {
        //
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        //
    }

    // Display the specified resource
    public function show($id)
    {
        //
    }

    // Show the form for editing the specified resource
    public function edit($id)
    {
        //
    }

    // Update the specified resource in storage
    public function update(Request $request, $id)
    {
        //
    }

    // Remove the specified resource from storage
    public function destroy($id)
    {
        //
    }
}
