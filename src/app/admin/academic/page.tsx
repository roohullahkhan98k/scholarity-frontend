"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { academicService } from '@/services/academicService';
import { Category, Subject } from '@/types';
import DataTable, { Column } from '@/components/admin/DataTable';
import { TableSkeleton } from '@/components/admin/Skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import toast from 'react-hot-toast';
import {
    BookOpen,
    Plus,
    Layers,
    Search,
    X,
    Filter,
    LayoutGrid,
    List,
    Edit2,
    Trash2
} from 'lucide-react';
import styles from './academic.module.css';

type Tab = 'CATEGORIES' | 'SUBJECTS';

export default function AcademicPage() {
    const [activeTab, setActiveTab] = useState<Tab>('CATEGORIES');
    const [categories, setCategories] = useState<Category[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    // Search & Filter
    const [catSearch, setCatSearch] = useState('');
    const [subSearch, setSubSearch] = useState('');
    const [selectedCatFilter, setSelectedCatFilter] = useState('');

    const debouncedCatSearch = useDebounce(catSearch, 500);
    const debouncedSubSearch = useDebounce(subSearch, 500);

    // Bulk Selection
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Modals & Action States
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isAddingSubject, setIsAddingSubject] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingSubject, setEditingSubject] = useState<Subject & { categoryId: string } | null>(null);

    // Data Form State
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newSubjectName, setNewSubjectName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        isLoading?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isLoading: false,
    });

    // Action Loading States
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        setSelectedIds([]); // Clear selection on tab/search change
        if (activeTab === 'CATEGORIES') {
            loadCategories();
        } else {
            loadSubjects();
        }
    }, [activeTab, debouncedCatSearch, debouncedSubSearch, selectedCatFilter]);

    // Added to load categories for the subject modal filter as well
    useEffect(() => {
        if (categories.length === 0) {
            academicService.getCategories().then(setCategories).catch(console.error);
        }
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await academicService.getCategories(debouncedCatSearch);
            setCategories(data);
        } catch (err: any) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const loadSubjects = async () => {
        try {
            setLoading(true);
            const data = await academicService.getSubjects(debouncedSubSearch, selectedCatFilter);
            setSubjects(data);
        } catch (err: any) {
            toast.error('Failed to load subjects');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            await academicService.createCategory(newCategoryName);
            setNewCategoryName('');
            setIsAddingCategory(false);
            toast.success('Category created successfully');
            loadCategories();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to create category');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryId) return;
        try {
            setActionLoading(true);
            await academicService.createSubject(newSubjectName, selectedCategoryId);
            setNewSubjectName('');
            setIsAddingSubject(false);
            toast.success('Subject created successfully');
            loadSubjects();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to create subject');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        try {
            setActionLoading(true);
            await academicService.updateCategory(editingCategory.id, editingCategory.name);
            setEditingCategory(null);
            toast.success('Category updated successfully');
            loadCategories();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update category');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSubject) return;
        try {
            setActionLoading(true);
            await academicService.updateSubject(editingSubject.id, editingSubject.name, editingSubject.categoryId);
            setEditingSubject(null);
            toast.success('Subject updated successfully');
            loadSubjects();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update subject');
        } finally {
            setActionLoading(false);
        }
    };

    const openDeleteCategoryModal = (id: string, name: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Category',
            message: `Are you sure you want to delete category "${name}" ? This will also affect all courses and subjects linked to it.`,
            onConfirm: () => handleDeleteCategory(id),
        });
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            setConfirmModal(prev => ({ ...prev, isLoading: true }));
            await academicService.deleteCategory(id);
            toast.success('Category deleted successfully');
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            loadCategories();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete category');
            setConfirmModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const openDeleteSubjectModal = (id: string, name: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Subject',
            message: `Are you sure you want to delete subject "${name}" ? This action cannot be undone.`,
            onConfirm: () => handleDeleteSubject(id),
        });
    };

    const handleDeleteSubject = async (id: string) => {
        try {
            setConfirmModal(prev => ({ ...prev, isLoading: true }));
            await academicService.deleteSubject(id);
            toast.success('Subject deleted successfully');
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            loadSubjects();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete subject');
            setConfirmModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    // Bulk Delete Logic
    const openBulkDeleteModal = () => {
        const type = activeTab === 'CATEGORIES' ? 'Categories' : 'Subjects';
        setConfirmModal({
            isOpen: true,
            title: `Bulk Delete ${type}`,
            message: `Are you sure you want to delete the ${selectedIds.length} selected ${type.toLowerCase()}? This action cannot be undone.`,
            onConfirm: handleBulkDelete,
        });
    };

    const handleBulkDelete = async () => {
        try {
            setConfirmModal(prev => ({ ...prev, isLoading: true }));
            if (activeTab === 'CATEGORIES') {
                await academicService.bulkDeleteCategories(selectedIds);
                toast.success('Categories deleted successfully');
                await loadCategories();
            } else {
                await academicService.bulkDeleteSubjects(selectedIds);
                toast.success('Subjects deleted successfully');
                await loadSubjects();
            }
            setSelectedIds([]);
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete selected items');
            setConfirmModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const categoryColumns: Column<Category>[] = [
        {
            key: 'name',
            header: 'Category Name',
            width: '60%',
            render: (row) => (
                <div className={styles.categoryInfo}>
                    <Layers size={18} className={styles.iconBlue} />
                    <span className={styles.nameText}>{row.name}</span>
                </div>
            )
        },
        {
            key: 'subjects',
            header: 'Subjects Count',
            width: '25%',
            render: (row) => (
                <span className={styles.countBadge}>
                    {row.subjects?.length || 0} Subjects
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '15%',
            render: (row) => (
                <div className={styles.tableActions}>
                    <button
                        className={styles.actionBtn}
                        onClick={() => {
                            setSelectedCategoryId(row.id);
                            setIsAddingSubject(true);
                        }}
                        title="Add Subject"
                    >
                        <Plus size={16} />
                    </button>
                    <button
                        className={styles.actionBtn}
                        onClick={() => setEditingCategory({ ...row })}
                        title="Edit Category"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.deleteBtn} `}
                        onClick={() => openDeleteCategoryModal(row.id, row.name)}
                        title="Delete Category"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    const subjectColumns: Column<Subject & { category?: { name: string; id: string } }>[] = [
        {
            key: 'name',
            header: 'Subject Name',
            width: '40%',
            render: (row) => (
                <div className={styles.categoryInfo}>
                    <BookOpen size={18} className={styles.iconAmber} />
                    <span className={styles.nameText}>{row.name}</span>
                </div>
            )
        },
        {
            key: 'category',
            header: 'Parent Category',
            width: '40%',
            render: (row) => (
                <span className={styles.parentCat}>
                    {(row as any).category?.name || 'N/A'}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '20%',
            render: (row) => (
                <div className={styles.tableActions}>
                    <button
                        className={styles.actionBtn}
                        onClick={() => setEditingSubject({
                            id: row.id,
                            name: row.name,
                            categoryId: (row as any).category?.id || ''
                        })}
                        title="Edit Subject"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.deleteBtn} `}
                        onClick={() => openDeleteSubjectModal(row.id, row.name)}
                        title="Delete Subject"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <div className={styles.iconWrapper}>
                            <BookOpen size={28} />
                        </div>
                        <div>
                            <h1 className={styles.title}>Academic Setup</h1>
                            <p className={styles.subtitle}>Phase 4: Manage platform curriculum with search & discovery</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {selectedIds.length > 0 && (
                            <button
                                className="btn"
                                onClick={openBulkDeleteModal}
                                style={{
                                    background: '#fee2e2',
                                    color: '#dc2626',
                                    border: '1px solid #fecaca',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontWeight: 500
                                }}
                            >
                                <Trash2 size={18} />
                                <span>Bulk Delete ({selectedIds.length})</span>
                            </button>
                        )}
                        <button
                            className="btn btn-primary"
                            onClick={() => activeTab === 'CATEGORIES' ? setIsAddingCategory(true) : setIsAddingSubject(true)}
                        >
                            <Plus size={18} />
                            <span>Add {activeTab === 'CATEGORIES' ? 'Category' : 'Subject'}</span>
                        </button>
                    </div>
                </div>

                <div className={styles.tabsSection}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'CATEGORIES' ? styles.activeTab : ''} `}
                            onClick={() => setActiveTab('CATEGORIES')}
                        >
                            <LayoutGrid size={18} />
                            Categories
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'SUBJECTS' ? styles.activeTab : ''} `}
                            onClick={() => setActiveTab('SUBJECTS')}
                        >
                            <List size={18} />
                            Subjects
                        </button>
                    </div>

                    <div className={styles.searchBar}>
                        <div className={styles.searchInputWrapper}>
                            <Search size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab.toLowerCase()}...`}
                                value={activeTab === 'CATEGORIES' ? catSearch : subSearch}
                                onChange={(e) => activeTab === 'CATEGORIES' ? setCatSearch(e.target.value) : setSubSearch(e.target.value)}
                                className={styles.searchInput}
                            />
                            {(catSearch || subSearch) && (
                                <button className={styles.clearBtn} onClick={() => activeTab === 'CATEGORIES' ? setCatSearch('') : setSubSearch('')}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {activeTab === 'SUBJECTS' && (
                            <div className={styles.filterWrapper}>
                                <Filter size={18} className={styles.filterIcon} />
                                <select
                                    value={selectedCatFilter}
                                    onChange={(e) => setSelectedCatFilter(e.target.value)}
                                    className={styles.filterSelect}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.tableCard}>
                    {loading ? (
                        <TableSkeleton rows={8} />
                    ) : (
                        activeTab === 'CATEGORIES' ? (
                            <DataTable
                                columns={categoryColumns as any}
                                data={categories}
                                emptyMessage="No categories found matching your search."
                                pageSize={10}
                                selectable={true}
                                onSelectionChange={setSelectedIds}
                            />
                        ) : (
                            <DataTable
                                columns={subjectColumns as any}
                                data={subjects}
                                emptyMessage="No subjects found matching your filters."
                                pageSize={10}
                                selectable={true}
                                onSelectionChange={setSelectedIds}
                            />
                        )
                    )}
                </div>

                {/* Modals remain same logic but styled to match */}
                {isAddingCategory && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h2>Add New Category</h2>
                                <button onClick={() => setIsAddingCategory(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleCreateCategory}>
                                <div className={styles.formGroup}>
                                    <label>Category Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Computer Science"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        required
                                        autoFocus
                                        className={styles.modalInput}
                                    />
                                </div>
                                <div className={styles.modalActions}>
                                    <button type="button" className="btn btn-outline" onClick={() => setIsAddingCategory(false)}>Cancel</button>
                                    <LoadingButton
                                        type="submit"
                                        isLoading={actionLoading}
                                        loadingText="Creating..."
                                        disabled={!newCategoryName}
                                    >
                                        Create Category
                                    </LoadingButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isAddingSubject && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h2>Add New Subject</h2>
                                <button onClick={() => setIsAddingSubject(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleCreateSubject}>
                                <div className={styles.formGroup}>
                                    <label>Parent Category</label>
                                    <select
                                        value={selectedCategoryId}
                                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                                        required
                                        className={styles.modalSelect}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Subject Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Data Structures"
                                        value={newSubjectName}
                                        onChange={(e) => setNewSubjectName(e.target.value)}
                                        required
                                        autoFocus
                                        className={styles.modalInput}
                                    />
                                </div>
                                <div className={styles.modalActions}>
                                    <button type="button" className="btn btn-outline" onClick={() => setIsAddingSubject(false)}>Cancel</button>
                                    <LoadingButton
                                        type="submit"
                                        isLoading={actionLoading}
                                        loadingText="Creating..."
                                        disabled={!newSubjectName || !selectedCategoryId}
                                    >
                                        Create Subject
                                    </LoadingButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Category Modal */}
                {editingCategory && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h2>Edit Category</h2>
                                <button onClick={() => setEditingCategory(null)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleUpdateCategory}>
                                <div className={styles.formGroup}>
                                    <label>Category Name</label>
                                    <input
                                        type="text"
                                        value={editingCategory.name}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                        required
                                        autoFocus
                                        className={styles.modalInput}
                                    />
                                </div>
                                <div className={styles.modalActions}>
                                    <button type="button" className="btn btn-outline" onClick={() => setEditingCategory(null)}>Cancel</button>
                                    <LoadingButton
                                        type="submit"
                                        isLoading={actionLoading}
                                        loadingText="Saving..."
                                    >
                                        Save Changes
                                    </LoadingButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Subject Modal */}
                {editingSubject && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h2>Edit Subject</h2>
                                <button onClick={() => setEditingSubject(null)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleUpdateSubject}>
                                <div className={styles.formGroup}>
                                    <label>Parent Category</label>
                                    <select
                                        value={editingSubject.categoryId}
                                        onChange={(e) => setEditingSubject({ ...editingSubject, categoryId: e.target.value })}
                                        required
                                        className={styles.modalSelect}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Subject Name</label>
                                    <input
                                        type="text"
                                        value={editingSubject.name}
                                        onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                                        required
                                        autoFocus
                                        className={styles.modalInput}
                                    />
                                </div>
                                <div className={styles.modalActions}>
                                    <button type="button" className="btn btn-outline" onClick={() => setEditingSubject(null)}>Cancel</button>
                                    <LoadingButton
                                        type="submit"
                                        isLoading={actionLoading}
                                        loadingText="Saving..."
                                    >
                                        Save Changes
                                    </LoadingButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                <ConfirmModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={confirmModal.onConfirm}
                    title={confirmModal.title}
                    message={confirmModal.message}
                    isDanger={true}
                    confirmText="Yes, Delete"
                    isLoading={confirmModal.isLoading}
                />
            </div>
        </ProtectedRoute>
    );
}
