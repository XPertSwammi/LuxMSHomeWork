import { BaseService } from "bi-internal/core";

interface IFiltersModel {
    loading?: boolean;
    error?: string;
    filters: Record<string, string[]>;
}

export class FiltersService extends BaseService<IFiltersModel> {
    public static _filterService: FiltersService;

    private constructor() {
        super({
          loading: false,
          error: '',
          filters: {}
        });
    }
    
    protected _dispose() {
        super._dispose();
    }

    public setFilters(filters) {
        this._updateWithData({filters});
    }

    public static getInstance() {
        if (!(window.__filterService)) {
            window.__filterService = new FiltersService();
        }
        return window.__filterService;
    }
}

FiltersService.getInstance();

declare global {
    interface Window {
      __filterService: FiltersService;
    }
  }