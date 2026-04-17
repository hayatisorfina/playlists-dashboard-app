"use client";

import React, { useState, useMemo } from "react";
import { Table, Input, Button, Popconfirm, message, Space, Typography, Tag, Layout, Breadcrumb } from "antd";
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Playlist } from "@/types/playlist";
import { deletePlaylist } from "@/lib/api/playlists";
import { PageShell } from "@/components/layout/page-shell";
import { PlaylistFormModal } from "@/components/playlists/PlaylistFormModal";

const { Search } = Input;
const { Text } = Typography;

export function PlaylistListPage({ initialData }: { initialData: Playlist[] }) {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  const filteredPlaylists = useMemo(() => {
    if (!searchText) return playlists;
    return playlists.filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [playlists, searchText]);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deletePlaylist(id); 
      message.success("Playlist deleted successfully");
      setPlaylists(prev => prev.filter(p => p.id !== id));
      router.refresh();
    } catch (err) {
      message.error("Failed to delete playlist");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Playlist) => (
        <Link href={`/playlists/${record.id}`} className="font-semibold text-blue-600">
          {text}
        </Link>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string | null) => (
        <Text ellipsis style={{ maxWidth: 300 }}>
          {text || "-"}
        </Text>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Playlist) => (
        <Space size="middle">
          <Link href={`/playlists/${record.id}`}>
            <Button type="text" icon={<EyeOutlined />} size="small">View</Button>
          </Link>
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => { setEditingPlaylist(record); setIsModalVisible(true); }}>Edit</Button>
          <Popconfirm
            title="Delete the playlist"
            description="Are you sure to delete this playlist?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageShell
      eyebrow="Dashboard"
      title="Playlists"
      description="Manage your digital signage playlists and their associated media items."
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingPlaylist(null); setIsModalVisible(true); }}>
          Create Playlist
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
          <Search 
            placeholder="Search playlists by name..." 
            allowClear 
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 300 }} 
          />
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table 
            columns={columns} 
            dataSource={filteredPlaylists} 
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>
      <PlaylistFormModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        playlist={editingPlaylist}
        onSuccess={(savedPlaylist) => {
          if (editingPlaylist) {
             setPlaylists(prev => prev.map(p => p.id === savedPlaylist.id ? savedPlaylist : p));
          } else {
             setPlaylists(prev => [savedPlaylist, ...prev]);
          }
        }}
      />
    </PageShell>
  );
}
