import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useCampaignStore } from "../../common/store/useCampaignStore";
import type { CampaignPayload } from "../../services/campaignsApi";
import styles from "./Campaigns.module.css";
import Layout from "../../common/components/Layout/Layout";
import Button from "../../common/components/Button/Button";
import Pagination from "../../common/components/Pagination/Pagination";
import Loading from "../../common/components/Loading/Loading";
import CampaignFormModal from "./components/CampaignFormModal.tsx";
import DeleteCampaignModal from "./components/DeleteCampaignModal.tsx";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 5;

export default function Campaigns() {
  const {
    campaigns,
    fetchCampaigns,
    addCampaign,
    editCampaign,
    removeCampaign,
    loading,
  } = useCampaignStore();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];

  const totalItems = safeCampaigns.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedCampaigns = safeCampaigns.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const editingCampaign =
    editingCampaignId === null
      ? null
      : safeCampaigns.find((campaign) => campaign.id === editingCampaignId) ?? null;

  const deletingCampaign =
    deleteId === null
      ? null
      : safeCampaigns.find((campaign) => campaign.id === deleteId) ?? null;

  const handleCreate = async (payload: CampaignPayload) => {
    try {
      await addCampaign(payload);
      setIsCreateOpen(false);
      toast.success("Kampaniya uğurla yaradıldı.");
    } catch {
      toast.error("Kampaniya yaradılarkən xəta baş verdi.");
    }
  };

  const handleEdit = async (payload: CampaignPayload) => {
    if (editingCampaignId === null) {
      return;
    }

    try {
      await editCampaign(editingCampaignId, payload);
      setEditingCampaignId(null);
      toast.success("Kampaniya uğurla yeniləndi.");
    } catch {
      toast.error("Kampaniya yenilənərkən xəta baş verdi.");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) {
      return;
    }

    try {
      await removeCampaign(deleteId);
      setDeleteId(null);
      toast.success("Kampaniya uğurla silindi.");
    } catch {
      toast.error("Kampaniya silinərkən xəta baş verdi.");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className={styles.title}>Kampaniyalar</h2>

          <div className={styles.actions}>
            <Button
              size="small"
              onClick={() => setIsCreateOpen(true)}
            >
              + Yeni Kampaniya
            </Button>
          </div>
        </div>

        <div className={styles.content}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sıra</th>
                <th>Şəkil</th>
                <th>Başlıq</th>
                <th>Açıqlama</th>
                <th>Tarix</th>
                <th>Əməliyyat</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <Loading />
                  </td>
                </tr>
              ) : safeCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6}>Kampaniya tapilmadi.</td>
                </tr>
              ) : (
                paginatedCampaigns.map((campaign, index) => (
                  <tr key={campaign.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>
                      {campaign.img_url ? (
                        <img
                          src={campaign.img_url}
                          alt={campaign.title}
                          className={styles.image}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{campaign.title}</td>
                    <td className={styles.desc}>
                      {campaign.description ?? "-"}
                    </td>
                    <td>
                      {new Date(campaign.created_at).toLocaleDateString(
                        "az-AZ",
                      )}
                    </td>

                    <td>
                      <div className={styles.buttons}>
                        <button
                          className={styles.edit}
                          onClick={() => setEditingCampaignId(campaign.id)}
                          title="Düzəlt"
                        >
                          <FiEdit2 size={13} />
                          Düzəlt
                        </button>
                        <button
                          className={styles.delete}
                          onClick={() => setDeleteId(campaign.id)}
                          title="Sil"
                        >
                          <FiTrash2 size={13} />
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.paginationRow}>
          <Pagination
            currentPage={page}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {isCreateOpen && (
        <CampaignFormModal
          isOpen={isCreateOpen}
          title="Yeni kampaniya"
          submitLabel="Yarat"
          isSubmitting={loading}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
        />
      )}

      {editingCampaign !== null && (
        <CampaignFormModal
          isOpen={true}
          title="Kampaniyanı düzəlt"
          submitLabel="Yadda saxla"
          initialValues={{
            title: editingCampaign.title,
            description: editingCampaign.description ?? "",
            img_url: editingCampaign.img_url ?? "",
          }}
          isSubmitting={loading}
          onClose={() => setEditingCampaignId(null)}
          onSubmit={handleEdit}
        />
      )}

      {deletingCampaign !== null && (
        <DeleteCampaignModal
          isOpen={true}
          campaignTitle={deletingCampaign.title}
          isSubmitting={loading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </Layout>
  );
}
