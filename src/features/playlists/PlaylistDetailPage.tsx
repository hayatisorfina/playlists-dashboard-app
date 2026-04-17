"use client";

import React, { useState } from "react";
import { Table, Button, Popconfirm, message, Space, Typography, Descriptions } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

import type { Playlist } from "@/types/playlist";
import type { MediaItem as importedMediaItem } from "@/types/media";
import { removeMediaFromPlaylist } from "@/lib/api/playlists";
import { PageShell } from "@/components/layout/page-shell";

const { Text, Title, Link: AntLink } = Typography;

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function PlaylistDetailPage({ initialData }: { initialData: Playlist }) {
  const router = useRouter();
  const [playlist, setPlaylist] = useState<Playlist>(initialData);
  const [loadingMediaId, setLoadingMediaId] = useState<string | null>(null);

  const handleRemoveMedia = async (mediaId: string) => {
    try {
      setLoadingMediaId(mediaId);
      await removeMediaFromPlaylist(playlist.id, mediaId);
      message.success("Media removed from playlist");
      setPlaylist(prev => ({
        ...prev,
        mediaItems: prev.mediaItems.filter(m => m.id !== mediaId)
      }));
      router.refresh();
    } catch (err) {
      message.error("Failed to remove media");
    } finally {
      setLoadingMediaId(null);
    }
  };

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
      width: 50,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Duration",
      dataIndex: "durationSeconds",
      key: "durationSeconds",
      render: (duration: number) => formatDuration(duration),
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <AntLink href={url} target="_blank" rel="noopener noreferrer" ellipsis style={{ maxWidth: 200 }}>
          {url}
        </AntLink>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: importedMediaItem) => (
        <Space size="middle">
          <Popconfirm
            title="Remove media"
            description="Are you sure you want to remove this media from the playlist?"
            onConfirm={() => handleRemoveMedia(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={loadingMediaId === record.id}
            >
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageShell
      eyebrow="Playlist Details"
      title={playlist.name}
      description="View and manage media assigned to this playlist."
      actions={
        <Space>
          <Button icon={<EditOutlined />}>Edit Playlist</Button>
        </Space>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <Descriptions title="Playlist Information" column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
            <Descriptions.Item label="Name">{playlist.name}</Descriptions.Item>
            <Descriptions.Item label="Created At">{new Date(playlist.createdAt).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label="Description" span={3}>
              {playlist.description || "No description provided."}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <Title level={4} style={{ margin: 0 }}>Media Items</Title>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Media
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={playlist.mediaItems}
            rowKey="id"
            pagination={false}
          />
        </div>
      </div>
    </PageShell>
  );
}
