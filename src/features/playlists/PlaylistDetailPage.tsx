"use client";

import React, { useState } from "react";
import { Table, Button, Popconfirm, message, Space, Typography, Card, Statistic, Row, Col, Tag } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, ArrowLeftOutlined, ClockCircleOutlined, VideoCameraOutlined, CalendarOutlined, FileTextOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { Playlist } from "@/types/playlist";
import type { MediaItem as importedMediaItem } from "@/types/media";
import { removeMediaFromPlaylist, getPlaylist } from "@/lib/api/playlists";
import { PageShell } from "@/components/layout/page-shell";
import { PlaylistFormModal } from "@/components/playlists/PlaylistFormModal";
import { MediaItemFormModal } from "@/components/playlists/MediaItemFormModal";

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);

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

  const totalDuration = playlist.mediaItems.reduce((acc, curr) => acc + curr.durationSeconds, 0);
  const mediaCount = playlist.mediaItems.length;

  return (
    <PageShell
      eyebrow="Playlist Details"
      title={playlist.name}
      description={playlist.description || "Manage the detailed view and content ordering for this playlist."}
      actions={
        <Space>
          <Link href="/playlists">
            <Button icon={<ArrowLeftOutlined />}>Back to Playlists</Button>
          </Link>
          <Button icon={<EditOutlined />} onClick={() => setIsModalVisible(true)}>Edit Playlist</Button>
        </Space>
      }
    >
      <div className="flex flex-col gap-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card className="h-full border-gray-200 shadow-sm group hover:border-blue-300 transition-colors" styles={{ body: { padding: '20px 24px' } }}>
              <Statistic 
                title={<Space className="text-gray-500 mb-1"><VideoCameraOutlined /> Total Media Items</Space>} 
                value={mediaCount} 
                styles={{ content: { fontWeight: 600 } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="h-full border-gray-200 shadow-sm group hover:border-blue-300 transition-colors" styles={{ body: { padding: '20px 24px' } }}>
              <Statistic 
                title={<Space className="text-gray-500 mb-1"><ClockCircleOutlined /> Total Duration</Space>} 
                value={formatDuration(totalDuration)} 
                styles={{ content: { fontWeight: 600 } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="h-full border-gray-200 shadow-sm group hover:border-blue-300 transition-colors" styles={{ body: { padding: '20px 24px' } }}>
              <Statistic 
                title={<Space className="text-gray-500 mb-1"><CalendarOutlined /> Created At</Space>} 
                value={new Date(playlist.createdAt).toLocaleDateString()}
                styles={{ content: { fontSize: '1.25rem', fontWeight: 500 } }}
              />
            </Card>
          </Col>
        </Row>

        <Card 
          title={<span className="text-lg font-semibold text-gray-800"><FileTextOutlined className="mr-2 text-gray-500" /> Media Content</span>}
          className="border-gray-200 shadow-sm overflow-hidden"
          styles={{ header: { borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa', padding: '16px 24px' }, body: { padding: 0 } }}
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsMediaModalVisible(true)}>
              Add Media
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={playlist.mediaItems}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </div>
      <PlaylistFormModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        playlist={playlist}
        onSuccess={(savedPlaylist) => setPlaylist(savedPlaylist)}
      />
      <MediaItemFormModal
        open={isMediaModalVisible}
        onClose={() => setIsMediaModalVisible(false)}
        playlistId={playlist.id}
        onSuccess={() => {
          getPlaylist(playlist.id).then(setPlaylist);
        }}
      />
    </PageShell>
  );
}
