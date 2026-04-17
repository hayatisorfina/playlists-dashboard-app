import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, message } from "antd";
import type { Playlist } from "@/types/playlist";
import { createMediaForPlaylist } from "@/lib/api/playlists";
import { useRouter } from "next/navigation";

interface MediaItemFormModalProps {
  open: boolean;
  onClose: () => void;
  playlistId: string;
  onSuccess?: (playlist: Playlist) => void;
}

interface AdHocMediaFormValues {
  title: string;
  durationSeconds: number;
  url: string;
}

export function MediaItemFormModal({ open, onClose, playlistId, onSuccess }: MediaItemFormModalProps) {
  const [form] = Form.useForm<AdHocMediaFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async (values: AdHocMediaFormValues) => {
    try {
      setSubmitting(true);
      const updatedPlaylist = await createMediaForPlaylist(playlistId, values);
      message.success("Media added successfully");
      
      onSuccess?.(updatedPlaylist);
      onClose();
      router.refresh();
    } catch (err) {
      message.error("Failed to add media to playlist");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Add Media to Playlist"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      destroyOnHidden
      okText="Add Media"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ title: "", durationSeconds: 10, url: "" }}
      >
        <Form.Item
          name="title"
          label="Media Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter media title" />
        </Form.Item>

        <Form.Item
          name="durationSeconds"
          label="Duration (Seconds)"
          rules={[{ required: true, message: "Please specify duration in seconds" }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="url"
          label="Media URL"
          rules={[{ required: true, message: "Please enter media URL" }, { type: "url", message: "Please enter a valid URL" }]}
        >
          <Input placeholder="https://example.com/media.mp4" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
