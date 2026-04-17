import React, { useEffect, useState } from "react";
import { Modal, Form, Input, message } from "antd";
import type { Playlist, PlaylistFormValues } from "@/types/playlist";
import { createPlaylist, updatePlaylist } from "@/lib/api/playlists";
import { useRouter } from "next/navigation";

interface PlaylistFormModalProps {
  open: boolean;
  onClose: () => void;
  playlist?: Playlist | null; // null/undefined means Create Mode
  onSuccess?: (playlist: Playlist) => void;
}

export function PlaylistFormModal({ open, onClose, playlist, onSuccess }: PlaylistFormModalProps) {
  const [form] = Form.useForm<PlaylistFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const isEditMode = !!playlist;

  useEffect(() => {
    if (open) {
      if (playlist) {
        form.setFieldsValue({
          name: playlist.name,
          description: playlist.description || "",
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, playlist, form]);

  const handleSubmit = async (values: PlaylistFormValues) => {
    try {
      setSubmitting(true);
      let savedPlaylist: Playlist;

      if (isEditMode) {
        savedPlaylist = await updatePlaylist(playlist.id, values);
        message.success("Playlist updated successfully");
      } else {
        savedPlaylist = await createPlaylist(values);
        message.success("Playlist created successfully");
      }

      onSuccess?.(savedPlaylist);
      onClose();
      router.refresh();
    } catch (err) {
      message.error(isEditMode ? "Failed to update playlist" : "Failed to create playlist");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={isEditMode ? "Edit Playlist" : "Create Playlist"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ name: "", description: "" }}
      >
        <Form.Item
          name="name"
          label="Playlist Name"
          rules={[{ required: true, message: "Please enter a playlist name" }]}
        >
          <Input placeholder="Enter playlist name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea placeholder="Optional description..." rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
