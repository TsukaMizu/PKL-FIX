<?php

namespace App\Http\Controllers;

use App\Models\CategoryTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CategoryTaskController extends Controller
{
    public function index()
    {
        $categoriestask = CategoryTask::query()
            ->select('id', 'tugas')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('AsistenManager/CategoriesTask/Index', [
            'category_task' => $categoriestask
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tugas' => 'required|string|max:255'
        ]);

        try {
            DB::beginTransaction();
            CategoryTask::create($validated);
            DB::commit();

            return redirect()->back()->with('success', 'Category Task created successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to create category Task');
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'tugas' => 'required|string|max:255'
        ]);

        try {
            DB::beginTransaction();
            $categorytask = CategoryTask::findOrFail($id);
            $categorytask->update($validated);
            DB::commit();

            return redirect()->back()->with('success', 'Category Task updated successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to update category task');
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            CategoryTask::findOrFail($id)->delete();
            DB::commit();

            return redirect()->back()->with('success', 'Category Task deleted successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to delete category task');
        }
    }
}
