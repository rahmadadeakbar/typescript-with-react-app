import React, { useEffect, useState } from "react";

type Student = {
	id: number;
	name: string;
	nim?: string;
	major?: string;
};

export default function App(): React.ReactElement {
	const [students, setStudents] = useState<Student[]>([]);
	const [name, setName] = useState("");
	const [nim, setNim] = useState("");
	const [major, setMajor] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

	// Load from API on mount
	useEffect(() => {
		let mounted = true;
		setLoading(true);
		fetch(`${API_BASE}/students`)
			.then((r) => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`);
				return r.json();
			})
			.then((data: Student[]) => {
				if (mounted) setStudents(data || []);
			})
			.catch((e) => {
				console.error("Failed to load students", e);
				if (mounted) setError(String(e));
			})
			.finally(() => mounted && setLoading(false));
		return () => {
			mounted = false;
		};
	}, [API_BASE]);

	const resetForm = () => {
		setName("");
		setNim("");
		setMajor("");
		setEditingId(null);
	};

	const handleAddOrUpdate = async () => {
		if (!name.trim()) return; // simple validation
		setError(null);
		try {
			if (editingId !== null) {
				const res = await fetch(`${API_BASE}/students/${editingId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name: name.trim(), nim: nim.trim(), major: major.trim() }),
				});
				if (!res.ok) throw new Error(`Failed to update: ${res.status}`);
				const updated: Student = await res.json();
				setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
				resetForm();
			} else {
				const res = await fetch(`${API_BASE}/students`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name: name.trim(), nim: nim.trim(), major: major.trim() }),
				});
				if (!res.ok) throw new Error(`Failed to create: ${res.status}`);
				const created: Student = await res.json();
				setStudents((prev) => [...prev, created]);
				resetForm();
			}
		} catch (e) {
			console.error(e);
			setError(String(e));
		}
	};

	const handleEdit = (id: number) => {
		const s = students.find((x) => x.id === id);
		if (!s) return;
		setName(s.name);
		setNim(s.nim ?? "");
		setMajor(s.major ?? "");
		setEditingId(id);
	};

	const handleDelete = async (id: number) => {
		setError(null);
		try {
			const res = await fetch(`${API_BASE}/students/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error(`Failed to delete: ${res.status}`);
			setStudents((prev) => prev.filter((s) => s.id !== id));
			if (editingId === id) resetForm();
		} catch (e) {
			console.error(e);
			setError(String(e));
		}
	};

	return (
		<div className="p-6 max-w-lg mx-auto space-y-4">
			<h1 className="text-2xl font-bold text-center">CRUD Mahasiswa — React + TypeScript</h1>

			{loading && <div className="text-center text-gray-600">Memuat data...</div>}
			{error && <div className="text-center text-red-600">{error}</div>}

			<div className="grid gap-2 sm:grid-cols-3">
				<input
					type="text"
					className="border rounded p-2 col-span-3"
					placeholder="Nama"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<input
					type="text"
					className="border rounded p-2"
					placeholder="NIM"
					value={nim}
					onChange={(e) => setNim(e.target.value)}
				/>
				<input
					type="text"
					className="border rounded p-2"
					placeholder="Jurusan"
					value={major}
					onChange={(e) => setMajor(e.target.value)}
				/>
				<div className="col-span-3">
					<button disabled={loading} onClick={handleAddOrUpdate} className="bg-blue-500 disabled:opacity-60 text-white px-4 py-2 rounded">
						{editingId !== null ? "Update" : "Tambah"}
					</button>
					{editingId !== null && (
						<button onClick={resetForm} className="ml-2 bg-gray-300 text-black px-3 py-2 rounded">
							Batal
						</button>
					)}
				</div>
			</div>

			<ul className="space-y-2">
				{students.length === 0 && <li className="text-center text-gray-500">Belum ada data mahasiswa.</li>}
				{students.map((s) => (
					<li key={s.id} className="flex justify-between items-center border p-2 rounded">
						<div>
							<div className="font-medium">{s.name}</div>
							<div className="text-sm text-gray-600">NIM: {s.nim || "-"} • Jurusan: {s.major || "-"}</div>
						</div>
						<div className="space-x-2">
							<button onClick={() => handleEdit(s.id)} className="bg-yellow-500 text-white px-3 py-1 rounded">
								Edit
							</button>
							<button onClick={() => handleDelete(s.id)} className="bg-red-500 text-white px-3 py-1 rounded">
								Hapus
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}