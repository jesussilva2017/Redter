import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search, ChevronDown, Check, X, AlertCircle } from 'lucide-react';

export interface SearchableOption {
  id: string | number;
  label: string;
  subtitle?: string;
}

interface SearchableSelectProps {
  label?: string;
  value: string;
  options: SearchableOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  disabledHint?: string;
  required?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  allowCustomValue?: boolean;
  onChange: (value: string, option?: SearchableOption) => void;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  value,
  options,
  placeholder = 'Seleccione una opción...',
  searchPlaceholder = 'Buscar...',
  disabled = false,
  disabledHint,
  required = false,
  hasError = false,
  errorMessage,
  allowCustomValue = false,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  // Cerrar al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside as any);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as any);
    };
  }, []);

  // Calculate dropdown position for mobile (fixed) vs desktop (absolute)
  const updateDropdownPosition = useCallback(() => {
    if (!containerRef.current || !isMobile) return;
    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const dropdownHeight = Math.min(320, viewportHeight * 0.5);
    
    if (spaceBelow < dropdownHeight && rect.top > spaceBelow) {
      // Open upwards
      setDropdownStyle({
        position: 'fixed',
        bottom: viewportHeight - rect.top + 4,
        left: rect.left,
        width: rect.width,
        maxHeight: Math.min(rect.top - 16, 320),
        zIndex: 9999,
      });
    } else {
      // Open downwards
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        maxHeight: Math.min(spaceBelow - 16, 320),
        zIndex: 9999,
      });
    }
  }, [isMobile]);

  // Autofocus en el input de búsqueda al abrir
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      setTimeout(() => {
        searchInputRef.current?.focus({ preventScroll: true });
      }, 80);
    } else {
      setSearch('');
    }
  }, [isOpen, updateDropdownPosition]);

  const normalizeStr = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const term = normalizeStr(search);
    return options.filter((opt) => normalizeStr(opt.label).includes(term) || (opt.subtitle && normalizeStr(opt.subtitle).includes(term)));
  }, [options, search]);

  const selectedOption = options.find((opt) => opt.label.toUpperCase() === value.toUpperCase() || String(opt.id) === value);

  const handleSelect = (opt: SearchableOption) => {
    onChange(opt.label, opt);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label
          className={`block font-semibold mb-1 transition-colors text-xs sm:text-sm ${
            hasError ? 'text-red-600' : 'text-gray-700'
          }`}
        >
          {label} {required && '*'}
        </label>
      )}

      {/* Botón selector */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-xl px-3 py-2.5 sm:py-2 text-sm sm:text-sm flex items-center justify-between transition focus:outline-none text-left min-h-[42px] sm:min-h-[38px] ${
          disabled
            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
            : hasError
            ? 'border-red-500 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            : isOpen
            ? 'border-navy ring-1 ring-navy text-gray-800'
            : 'border-line-strong text-gray-800 hover:border-gray-400 focus:border-navy focus:ring-1 focus:ring-navy'
        }`}
      >
        <span className={`truncate ${!selectedOption && !value ? 'text-gray-400' : 'text-gray-800 font-medium'}`}>
          {disabled && disabledHint ? disabledHint : (selectedOption?.label || value || placeholder)}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ml-1 ${
            isOpen ? 'transform rotate-180 text-navy' : ''
          }`}
        />
      </button>

      {/* Menú desplegable flotante con buscador */}
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className={`bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${
            isMobile ? '' : 'absolute z-50 mt-1 w-full'
          }`}
          style={isMobile ? dropdownStyle : undefined}
        >
          {/* Campo buscador */}
          <div className="p-2 border-b border-gray-100 bg-slate-50/70">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-7 py-2 sm:py-1.5 text-sm sm:text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Opción para usar valor personalizado cuando se escribe */}
          {allowCustomValue && search.trim() && !options.some(o => o.label.toLowerCase() === search.trim().toLowerCase()) && (
            <div
              onClick={() => handleSelect({ id: 'custom-' + Date.now(), label: search.trim() })}
              className="px-3 py-2.5 sm:py-2 text-xs font-semibold text-navy bg-navy/5 hover:bg-navy/10 active:bg-navy/15 border-b border-gray-100 cursor-pointer flex items-center justify-between transition-colors"
            >
              <span>➕ Usar &ldquo;<span className="underline">{search.trim()}</span>&rdquo;</span>
              <span className="text-[10px] text-gray-500 font-normal">Personalizado</span>
            </div>
          )}

          {/* Lista de opciones filtradas */}
          <div className="max-h-52 sm:max-h-56 overflow-y-auto divide-y divide-gray-50 py-1 overscroll-contain">
            {filteredOptions.length === 0 ? (
              <div className="py-5 px-3 text-center text-xs text-gray-400">
                No se encontraron resultados para &ldquo;{search}&rdquo;
                {allowCustomValue && (
                  <p className="mt-1 text-[11px] text-navy font-medium">
                    Puedes hacer clic arriba en &ldquo;Usar {search}&rdquo; para registrarlo.
                  </p>
                )}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected =
                  opt.label.toUpperCase() === value.toUpperCase() ||
                  String(opt.id) === value;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelect(opt)}
                    className={`px-3 py-2.5 sm:py-2 text-sm sm:text-sm cursor-pointer flex items-center justify-between transition-colors active:bg-slate-200 ${
                      isSelected
                        ? 'bg-navy/10 text-navy font-semibold'
                        : 'text-gray-700 hover:bg-slate-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="block truncate">{opt.label}</span>
                      {opt.subtitle && (
                        <span className="block text-[10px] text-gray-400 font-normal truncate">
                          {opt.subtitle}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-navy flex-shrink-0 ml-2" />}
                  </div>
                );
              })
            )}
          </div>

          {/* Pie de lista con conteo */}
          <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500 flex justify-between items-center">
            <span>{filteredOptions.length} disponibles</span>
            {search && <span className="truncate ml-2">Filtrado por &ldquo;{search}&rdquo;</span>}
          </div>
        </div>
      )}

      {/* Alerta de error debajo del campo */}
      {hasError && errorMessage && (
        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
};
