import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TableSkeleton } from './Skeleton';
import styles from './DataTable.module.css';

export interface Column<T> {
    key: string;
    header: string;
    width?: string;
    render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    pageSize?: number;
    selectable?: boolean;
    onSelectionChange?: (selectedIds: string[]) => void;
}

export default function DataTable<T extends { id: string }>({
    columns,
    data,
    loading = false,
    emptyMessage = 'No data available',
    pageSize = 10,
    selectable = false,
    onSelectionChange
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const totalPages = Math.ceil(data.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = data.slice(startIndex, endIndex);

    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(selectedIds);
        }
    }, [selectedIds, onSelectionChange]);

    // Clear selection when data changes or page changes if desired, 
    // but usually users expect selection to persist across pages? 
    // For simplicity, let's keep selection across pages but rely on IDs.

    // However, if we delete items, we should clear those IDs. 
    // The parent component handles data updates, so we might need to sync.
    // Let's assume parent clears selection after bulk action.

    const toggleSelectAll = () => {
        if (selectedIds.length === data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(data.map(item => item.id));
        }
    };

    const toggleSelectRow = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    if (loading) {
        return <TableSkeleton rows={pageSize} />;
    }

    if (data.length === 0) {
        return (
            <div className={styles.empty}>
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {selectable && (
                                <th style={{ width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.length > 0 && selectedIds.length === data.length}
                                        onChange={toggleSelectAll}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    style={{ width: column.width }}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((row) => (
                            <tr key={row.id}>
                                {selectable && (
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(row.id)}
                                            onChange={() => toggleSelectRow(row.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </td>
                                )}
                                {columns.map((column) => (
                                    <td key={column.key}>
                                        {column.render
                                            ? column.render(row)
                                            : (row as any)[column.key]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <div className={styles.paginationInfo}>
                        Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
                    </div>
                    <div className={styles.paginationControls}>
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={styles.pageBtn}
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>

                        <div className={styles.pageNumbers}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`${styles.pageNumber} ${page === currentPage ? styles.active : ''}`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (page === currentPage - 2 || page === currentPage + 2) {
                                    return <span key={page} className={styles.ellipsis}>...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={styles.pageBtn}
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
