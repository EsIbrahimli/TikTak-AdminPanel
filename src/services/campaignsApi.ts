import { axiosInstance } from "./axiosInstance";

export interface Campaign {
	id: number;
	title: string;
	description: string | null;
	img_url: string | null;
	created_at: string;
}

export interface CampaignPayload {
	title: string;
	description?: string | null;
	img_url?: string | null;
}

export const getCampaigns = async (): Promise<Campaign[]> => {
	const res = await axiosInstance.get("admin/campaigns");
	return res.data;
};

export const getCampaignById = async (
	id: number | string
): Promise<Campaign> => {
	const res = await axiosInstance.get(`admin/campaigns/${id}`);
	return res.data;
};

export const createCampaign = async (
	payload: CampaignPayload
): Promise<Campaign> => {
	const res = await axiosInstance.post("admin/campaign", payload);
	return res.data;
};

export const updateCampaign = async (
	id: number | string,
	payload: Partial<CampaignPayload>
): Promise<Campaign> => {
	const res = await axiosInstance.put(`admin/campaigns/${id}`, payload);
	return res.data;
};

export const deleteCampaign = async (
	id: number | string
): Promise<void> => {
	const res = await axiosInstance.delete(`admin/campaigns/${id}`);
	return res.data;
};
