import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader2, Inbox, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T | string)[];
  pageSize?: number;
  emptyMessage?: string;
  toolbar?: React.ReactNode;
  onRowClick?: (row: T) => void;
  keyExtractor?: (row: T, index: number) => string | number;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  searchable = true,
  searchPlaceholder = 'Cari data...',
  searchKeys,
  pageSize = 10,
  emptyMessage = 'Belum ada data untuk ditampilkan.',
  toolbar,
  onRowClick,
  keyExtractor,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter Data
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const term = search.toLowerCase();

    return data.filter((item) => {
      if (searchKeys && searchKeys.length > 0) {
        return searchKeys.some((key) => {
          const val = item[key];
          return val !== null && val !== undefined && String(val).toLowerCase().includes(term);
        });
      }
      // Fallback: search across all string/number fields
      return Object.values(item).some(
        (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(term)
      );
    });
  }, [data, search, searchKeys]);

  // Sort Data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination Data
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Search & Toolbar */}
      {(searchable || toolbar) && (
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          {searchable ? (
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 text-sm shadow-xs"
              />
            </div>
          ) : (
            <div />
          )}

          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`font-bold text-xs uppercase tracking-wider text-slate-600 py-3.5 ${
                    col.align === 'center'
                      ? 'text-center'
                      : col.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <span>{col.header}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-16 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#419CC3]" />
                  <span>Memuat data...</span>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-16 text-slate-400">
                  <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <span>{emptyMessage}</span>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rIdx) => {
                const key = keyExtractor ? keyExtractor(row, rIdx) : row.id || rIdx;
                return (
                  <TableRow
                    key={key}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors hover:bg-slate-50/60 ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={`${
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                            ? 'text-right'
                            : 'text-left'
                        } ${col.className || ''}`}
                      >
                        {col.render
                          ? col.render(row, (currentPage - 1) * pageSize + rIdx)
                          : row[col.key] ?? '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {!isLoading && sortedData.length > pageSize && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
            <div>
              Menampilkan{' '}
              <strong className="text-slate-800">
                {(currentPage - 1) * pageSize + 1}
              </strong>{' '}
              -{' '}
              <strong className="text-slate-800">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </strong>{' '}
              dari <strong className="text-slate-800">{sortedData.length}</strong> data
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 px-2 border-slate-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-2 font-medium">
                Hal {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="h-8 px-2 border-slate-200"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
