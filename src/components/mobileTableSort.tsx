import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

interface SortOption {
  id: string;
  label: string;
}

interface MobileTableSortProps {
  options: SortOption[];
  columnId: string;
  descending: boolean;
  onChange: (columnId: string, descending: boolean) => void;
}

export function MobileTableSort({
  options,
  columnId,
  descending,
  onChange,
}: MobileTableSortProps) {
  return (
    <div className="mobile-table-sort">
      <label className="search-field__label" htmlFor="mobile-table-sort-trigger">
        Sort by
      </label>
      <Select.Root
        value={`${columnId}:${descending ? "desc" : "asc"}`}
        onValueChange={(value) => {
          const [id, direction] = value.split(":");
          onChange(id, direction === "desc");
        }}
      >
        <Select.Trigger
          id="mobile-table-sort-trigger"
          className="mobile-table-sort__trigger"
        >
          <Select.Value />
          <Select.Icon aria-hidden="true">
            <ChevronDown size={16} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="mobile-table-sort__content"
            position="popper"
            sideOffset={4}
          >
            <Select.Viewport className="mobile-table-sort__viewport">
              {options.flatMap((option) =>
                (["asc", "desc"] as const).map((direction) => (
                  <Select.Item
                    className="mobile-table-sort__item"
                    key={`${option.id}:${direction}`}
                    value={`${option.id}:${direction}`}
                  >
                    <Select.ItemText>
                      {option.label} {direction === "asc" ? "ascending" : "descending"}
                    </Select.ItemText>
                    <Select.ItemIndicator>
                      <Check size={16} aria-hidden="true" />
                    </Select.ItemIndicator>
                  </Select.Item>
                )),
              )}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
