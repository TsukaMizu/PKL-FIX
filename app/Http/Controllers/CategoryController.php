<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::query()
            ->select('id', 'nama', 'kode', 'deskripsi')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('AsistenManager/Categories/Index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:255|unique:categories',
            'deskripsi' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();
            Category::create($validated);
            DB::commit();

            return redirect()->back()->with('success', 'Category created successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to create category');
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => "required|string|max:255|unique:categories,kode,{$id}",
            'deskripsi' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();
            $category = Category::findOrFail($id);
            $category->update($validated);
            DB::commit();

            return redirect()->back()->with('success', 'Category updated successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to update category');
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            Category::findOrFail($id)->delete();
            DB::commit();

            return redirect()->back()->with('success', 'Category deleted successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to delete category');
        }
    }
}