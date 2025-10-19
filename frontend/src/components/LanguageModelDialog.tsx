import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { LanguageModelCreate, LanguageModelUpdate } from '../types/languageModel';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { useToast } from '../hooks/use-toast';

interface LanguageModelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    modelId?: number | null;
    onSuccess: () => void;
}

export function LanguageModelDialog({ open, onOpenChange, modelId, onSuccess }: LanguageModelDialogProps) {
    const { toast } = useToast();
    const isEditMode = !!modelId;

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        notes: '',
    });

    useEffect(() => {
        if (open && modelId) {
            fetchModel();
        } else if (open && !modelId) {
            // Reset form for create mode
            setFormData({ name: '', notes: '' });
        }
    }, [open, modelId]);

    const fetchModel = async () => {
        if (!modelId) return;

        try {
            setLoading(true);
            const model = await api.getLanguageModel(modelId);
            setFormData({
                name: model.name,
                notes: model.notes || '',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to fetch language model',
            });
            onOpenChange(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Name is required',
            });
            return;
        }

        try {
            setSubmitting(true);

            if (isEditMode && modelId) {
                const updateData: LanguageModelUpdate = {
                    name: formData.name,
                    notes: formData.notes || null,
                };
                await api.updateLanguageModel(modelId, updateData);
                toast({
                    title: 'Success',
                    description: 'Language model updated successfully',
                });
            } else {
                const createData: LanguageModelCreate = {
                    name: formData.name,
                    notes: formData.notes || null,
                };
                await api.createLanguageModel(createData);
                toast({
                    title: 'Success',
                    description: 'Language model created successfully',
                });
            }

            onOpenChange(false);
            onSuccess();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'create'} language model`,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit' : 'Create'} Language Model</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Update the details of your language model'
                            : 'Add a new language model to your collection'}
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="py-8 text-center text-muted-foreground">Loading...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., GPT-3.5-turbo, Llama-2-7B"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>

                            {/* Notes Field */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Add any notes or description about this model..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={4}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

