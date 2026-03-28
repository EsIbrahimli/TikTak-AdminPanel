import { create } from "zustand";
import {
  createCampaign,
  deleteCampaign,
  getCampaigns,
  updateCampaign,
} from "../../services/campaignsApi";
import type { Campaign, CampaignPayload } from "../../services/campaignsApi";

interface CampaignsState {
  campaigns: Campaign[];
  loading: boolean;
  fetchCampaigns: () => Promise<void>;
  addCampaign: (payload: CampaignPayload) => Promise<void>;
  editCampaign: (
    id: number,
    payload: Partial<CampaignPayload>
  ) => Promise<void>;
  removeCampaign: (id: number) => Promise<void>;
}

type CampaignsApiResponse =
  | Campaign[]
  | {
      data?: Campaign[] | { data?: Campaign[]; campaigns?: Campaign[] };
      campaigns?: Campaign[];
    };

type CampaignApiResponse = unknown;

const normalizeCampaigns = (payload: CampaignsApiResponse): Campaign[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.campaigns)) {
    return payload.campaigns;
  }

  if (payload?.data && typeof payload.data === "object") {
    if (Array.isArray(payload.data.data)) {
      return payload.data.data;
    }

    if (Array.isArray(payload.data.campaigns)) {
      return payload.data.campaigns;
    }
  }

  return [];
};

const normalizeCampaign = (payload: CampaignApiResponse): Campaign | null => {
  const asRecord = (value: unknown): Record<string, unknown> | null => {
    return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  };

  const asCampaign = (value: unknown): Campaign | null => {
    const record = asRecord(value);
    if (!record) {
      return null;
    }

    return typeof record.id === "number" ? (record as unknown as Campaign) : null;
  };

  const directCampaign = asCampaign(payload);
  if (directCampaign) {
    return directCampaign;
  }

  const payloadRecord = asRecord(payload);
  if (!payloadRecord) {
    return null;
  }

  const dataCampaign = asCampaign(payloadRecord.data);
  if (dataCampaign) {
    return dataCampaign;
  }

  const nestedDataRecord = asRecord(payloadRecord.data);
  const nestedDataCampaign = asCampaign(nestedDataRecord?.data);
  if (nestedDataCampaign) {
    return nestedDataCampaign;
  }

  const nestedCampaign = asCampaign(nestedDataRecord?.campaign);
  if (nestedCampaign) {
    return nestedCampaign;
  }

  return asCampaign(payloadRecord.campaign);
};

export const useCampaignStore = create<CampaignsState>((set) => ({
  campaigns: [],
  loading: false,

  fetchCampaigns: async () => {
    set({ loading: true });
    try {
      const data = await getCampaigns();
      const normalizedCampaigns = normalizeCampaigns(data as CampaignsApiResponse);

      set({
        campaigns: normalizedCampaigns,
      });
    } finally {
      set({ loading: false });
    }
  },

  addCampaign: async (payload) => {
    set({ loading: true });
    try {
      const createdCampaign = await createCampaign(payload);
      const normalizedCreatedCampaign = normalizeCampaign(
        createdCampaign as CampaignApiResponse
      );

      if (!normalizedCreatedCampaign) {
        return;
      }

      set((state) => ({
        campaigns: [normalizedCreatedCampaign, ...state.campaigns],
      }));
    } finally {
      set({ loading: false });
    }
  },

  editCampaign: async (id, payload) => {
    set({ loading: true });
    try {
      const updatedCampaign = await updateCampaign(id, payload);
      const normalizedUpdatedCampaign = normalizeCampaign(
        updatedCampaign as CampaignApiResponse
      );

      if (!normalizedUpdatedCampaign) {
        return;
      }

      set((state) => ({
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === id ? normalizedUpdatedCampaign : campaign
        ),
      }));
    } finally {
      set({ loading: false });
    }
  },

  removeCampaign: async (id: number) => {
    set({ loading: true });
    try {
      await deleteCampaign(id);

      set((state) => ({
        campaigns: state.campaigns.filter((c) => c.id !== id),
      }));
    } finally {
      set({ loading: false });
    }
  },
}));
