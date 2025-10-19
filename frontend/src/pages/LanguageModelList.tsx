import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import type { LanguageModel } from '../types/languageModel';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog';
import { LanguageModelDialog } from '../components/LanguageModelDialog';

export function LanguageModelList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [models, setModels] = useState<LanguageModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [modelToDelete, setModelToDelete] = useState<LanguageModel | null>(null);
    const [deleting, setDeleting] = useState(false);
    const { toast } = useToast();

    // Dialog state from URL params
    const isCreateDialogOpen = searchParams.get('create') === 'true';
    const editModelId = searchParams.get('edit') ? parseInt(searchParams.get('edit')!) : null;

    const fetchModels = async () => {
        try {
            setLoading(true);
            const data = await api.getLanguageModels(0, 100, searchQuery || undefined);
            setModels(data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to fetch language models',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchModels();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleDelete = async () => {
        if (!modelToDelete) return;

        try {
            setDeleting(true);
            await api.deleteLanguageModel(modelToDelete.id);
            toast({
                title: 'Success',
                description: 'Language model deleted successfully',
            });
            setDeleteDialogOpen(false);
            setModelToDelete(null);
            fetchModels();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to delete language model',
            });
        } finally {
            setDeleting(false);
        }
    };

    const openDeleteDialog = (model: LanguageModel) => {
        setModelToDelete(model);
        setDeleteDialogOpen(true);
    };

    const openCreateDialog = () => {
        setSearchParams({ create: 'true' });
    };

    const openEditDialog = (modelId: number) => {
        setSearchParams({ edit: modelId.toString() });
    };

    const closeFormDialog = () => {
        setSearchParams({});
    };

    const handleFormSuccess = () => {
        fetchModels();
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Language Models</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your small language models
                        </p>
                    </div>
                    <Button onClick={openCreateDialog} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Model
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search language models..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Models List */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                ) : models.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center">
                                <p className="text-muted-foreground mb-4">
                                    {searchQuery ? 'No language models found matching your search' : 'No language models yet'}
                                </p>
                                {!searchQuery && (
                                    <Button onClick={openCreateDialog} className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Your First Model
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {models.map((model) => (
                            <Card key={model.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{model.name}</CardTitle>
                                    <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                                        {model.notes || 'No description provided'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-2"
                                            onClick={() => openEditDialog(model.id)}
                                        >
                                            <Pencil className="h-3 w-3" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => openDeleteDialog(model)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Dialog */}
            <LanguageModelDialog
                open={isCreateDialogOpen || !!editModelId}
                onOpenChange={(open) => {
                    if (!open) closeFormDialog();
                }}
                modelId={editModelId}
                onSuccess={handleFormSuccess}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Language Model</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{modelToDelete?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

