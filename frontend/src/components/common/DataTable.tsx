import React, { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Inbox,
  Loader2,
  Search,
} from 'lucide-react';
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  RowData,
  SortingState,
} from '@tanstack/react-table';
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

export interface DataTableColumnMeta {
  align?: 'left' | 'center' | 'right';
  className?: string;
}

/**
 * The one feature set every table in this app uses: global search, sorting,
 * client pagination. Nothing else is registered, so nothing else ships.
 */
export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  // Type-only slot: gives every column a typed `meta` for presentation hints.
  columnMeta: {} as DataTableColumnMeta,
});

export type DataTableFeatures = typeof dataTableFeatures;
export type DataTableColumn<T extends RowData> = ColumnDef<DataTableFeatures, T, any>;

/** Column helper bound to this app's feature set. */
export const dataTableHelper = <T extends RowData>() =>
  createColumnHelper<DataTableFeatures, T>();

const alignClass = (align?: 'left' | 'center' | 'right') =>
  align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

const EMPTY: never[] = [];

/** `sort=field` / `sort=-field` in the URL. */
const parseSorting = (raw: string | null): SortingState =>
  raw ? [{ id: raw.replace(/^-/, ''), desc: raw.startsWith('-') }] : [];

const serializeSorting = (sorting: SortingState) =>
  sorting[0] ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` : '';

export interface DataTableProps<T extends RowData> {
  data: T[];
  columns: DataTableColumn<T>[];
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  emptyMessage?: string;
  toolbar?: React.ReactNode;
  onRowClick?: (row: T) => void;
  getRowId?: (row: T, index: number) => string;
  /**
   * Set to keep search/sort/page in the URL under this prefix, so a filtered
   * view survives reload and can be shared. Omit for tables nobody links to.
   */
  urlKey?: string;
}

export function DataTable<T extends RowData>({
  data,
  columns,
  isLoading = false,
  searchable = true,
  searchPlaceholder = 'Cari data...',
  pageSize = 10,
  emptyMessage = 'Belum ada data untuk ditampilkan.',
  toolbar,
  onRowClick,
  getRowId,
  urlKey,
}: DataTableProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const key = useCallback((name: string) => `${urlKey}.${name}`, [urlKey]);

  // URL-owned slices. Only read when `urlKey` is set; otherwise the table owns them.
  // Search text stays table-owned: round-tripping every keystroke through the
  // router makes the input drop characters.
  const urlState = useMemo(
    () => ({
      sorting: parseSorting(searchParams.get(key('sort'))),
      pagination: {
        pageIndex: Math.max(0, Number(searchParams.get(key('page')) ?? 1) - 1),
        pageSize,
      },
    }),
    [searchParams, key, pageSize],
  );

  const writeUrl = useCallback(
    (patch: Record<string, string>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [name, value] of Object.entries(patch)) {
            if (value) next.set(key(name), value);
            else next.delete(key(name));
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams, key],
  );

  const resolve = <S,>(updater: Parameters<OnChangeFn<S>>[0], current: S) =>
    typeof updater === 'function' ? (updater as (old: S) => S)(current) : updater;

  const urlOptions = urlKey
    ? {
        state: urlState,
        onSortingChange: ((updater) =>
          writeUrl({
            sort: serializeSorting(resolve(updater, urlState.sorting)),
          })) as OnChangeFn<SortingState>,
        onPaginationChange: ((updater) =>
          writeUrl({
            page: String(resolve(updater, urlState.pagination).pageIndex + 1),
          })) as OnChangeFn<PaginationState>,
      }
    : {};

  const table = useTable(
    {
      features: dataTableFeatures,
      data: data ?? EMPTY,
      columns,
      getRowId,
      globalFilterFn: 'includesString',
      // An "actions" column has nothing to match against.
      getColumnCanGlobalFilter: (column) => column.id !== 'actions',
      initialState: { pagination: { pageIndex: 0, pageSize } },
      ...urlOptions,
    },
    // Only these slices drive a rerender of the shell.
    (state) => ({
      globalFilter: state.globalFilter,
      pagination: state.pagination,
    }),
  );

  const { globalFilter, pagination } = table.state;
  const leafCount = table.getAllLeafColumns().length;
  const rows = table.getRowModel().rows;
  const totalRows = table.getRowCount();
  const firstRow = pagination.pageIndex * pagination.pageSize + 1;

  return (
    <div className="space-y-4">
      {(searchable || toolbar) && (
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          {searchable ? (
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={globalFilter ?? ''}
                onChange={(e) => table.setGlobalFilter(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 text-sm shadow-xs"
              />
            </div>
          ) : (
            <div />
          )}
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      aria-sort={
                        sorted === 'asc'
                          ? 'ascending'
                          : sorted === 'desc'
                          ? 'descending'
                          : header.column.getCanSort()
                          ? 'none'
                          : undefined
                      }
                      className={`font-bold text-xs uppercase tracking-wider text-slate-600 py-3.5 ${alignClass(
                        meta?.align,
                      )} ${meta?.className ?? ''}`}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <table.FlexRender header={header} />
                          {sorted === 'asc' ? (
                            <ChevronUp className="w-3 h-3 text-[#419CC3]" />
                          ) : sorted === 'desc' ? (
                            <ChevronDown className="w-3 h-3 text-[#419CC3]" />
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 text-slate-400" />
                          )}
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={leafCount} className="text-center py-16 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#419CC3]" />
                  <span>Memuat data...</span>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={leafCount} className="text-center py-16 text-slate-400">
                  <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <span>{globalFilter ? 'Tidak ada hasil yang cocok.' : emptyMessage}</span>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={`transition-colors hover:bg-slate-50/60 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {row.getAllCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;
                    return (
                      <TableCell
                        key={cell.id}
                        className={`${alignClass(meta?.align)} ${meta?.className ?? ''}`}
                      >
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!isLoading && table.getPageCount() > 1 && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
            <div>
              Menampilkan <strong className="text-slate-800">{firstRow}</strong> -{' '}
              <strong className="text-slate-800">
                {Math.min(firstRow + pagination.pageSize - 1, totalRows)}
              </strong>{' '}
              dari <strong className="text-slate-800">{totalRows}</strong> data
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Halaman sebelumnya"
                className="h-8 px-2 border-slate-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-2 font-medium">
                Hal {pagination.pageIndex + 1} dari {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Halaman berikutnya"
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
