import React, { useState, useEffect } from 'react';
import BulkUpload from '../../components/admin/BulkUpload';

export default function Houses() {
  const [housesData, setHousesData] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedHouses, setSelectedHouses] = useState([]);
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    country: '',
    address: '',
    price: '',
    image: ''
  });

  const [editIndex, setEditIndex] = useState(0);
  const [isAddingInline, setIsAddingInline] = useState(false);
  const [inlineFormData, setInlineFormData] = useState({
    name: '',
    type: '',
    country: '',
    address: '',
    price: '',
    image: ''
  });

  // Load houses từ API
  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/houses');
      const data = await res.json();
      setHousesData(data);
    } catch (err) {
      setError('Không thể tải danh sách nhà');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Lọc danh sách theo search
  const filtered = housesData.filter(
    h =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.country.toLowerCase().includes(search.toLowerCase())
  );

  // Tick chọn
  const toggleSelectHouse = (house) => {
    if (selectedHouses.some(h => h._id === house._id)) {
      setSelectedHouses(selectedHouses.filter(h => h._id !== house._id));
    } else {
      setSelectedHouses([...selectedHouses, house]);
    }
  };

  // Xóa
  const handleDelete = async () => {
    if (selectedHouses.length === 0) return alert('Vui lòng chọn nhà!');
    if (!window.confirm(`Bạn có chắc muốn xóa ${selectedHouses.length} nhà này?`)) return;

    setLoading(true);
    try {
      const ids = selectedHouses.map(h => h._id);
      const res = await fetch('http://localhost:5000/api/houses/delete-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });

      if (!res.ok) throw new Error('Xóa thất bại');

      await fetchHouses(); // Reload danh sách
      setSelectedHouses([]);
      setMode(null);
      alert('Xóa thành công!');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Chuẩn bị sửa
  const handleEditClick = () => {
    if (selectedHouses.length === 0) return alert('Vui lòng chọn nhà để sửa!');
    setEditIndex(0);
    setFormData({ ...selectedHouses[0] });
    setMode('edit');
  };

  // Submit sửa
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const houseToEdit = selectedHouses[editIndex];

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/houses/${houseToEdit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: Number(formData.price) })
      });

      if (!res.ok) throw new Error('Cập nhật thất bại');

      await fetchHouses(); // Reload danh sách

      if (editIndex + 1 < selectedHouses.length) {
        setEditIndex(editIndex + 1);
        setFormData({ ...selectedHouses[editIndex + 1] });
      } else {
        setSelectedHouses([]);
        setMode(null);
        alert('Cập nhật thành công!');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Thêm house mới
  const handleAddHouse = async () => {
    if (!inlineFormData.name || !inlineFormData.type || !inlineFormData.price) {
      return alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/houses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inlineFormData, price: Number(inlineFormData.price) })
      });

      if (!res.ok) throw new Error('Thêm thất bại');

      await fetchHouses(); // Reload danh sách
      setInlineFormData({ name: '', type: '', country: '', address: '', price: '', image: '' });
      setIsAddingInline(false);
      alert('Thêm thành công!');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Danh sách Phòng Cho Thuê</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded">
          {error}
        </div>
      )}

      {/* Bulk Upload Section */}
      {showBulkUpload && (
        <div className="mb-6">
          <BulkUpload onUploadComplete={() => {
            fetchHouses();
            setShowBulkUpload(false);
          }} />
        </div>
      )}

      {/* Ô tìm kiếm + các nút */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <input
          type="text"
          placeholder=""
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring text-gray-900 dark:text-gray-200"
        />

        <div className="flex gap-2">
          <button
            onClick={() => setShowBulkUpload(!showBulkUpload)}
            className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Bulk Upload
          </button>

          <button
            onClick={() => {
              setIsAddingInline(true);
              setMode(null);
            }}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            Thêm
          </button>

          {/* Nhóm nút Sửa */}
          {mode !== 'select-edit' ? (
            <button
              onClick={() => setMode('select-edit')}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Sửa
            </button>
          ) : (
            <>
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
              >
                OK
              </button>
              <button
                onClick={() => { setMode(null); setSelectedHouses([]); }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Hủy
              </button>
            </>
          )}

          {/* Nhóm nút Xóa */}
          {mode !== 'delete' ? (
            <button
              onClick={() => setMode('delete')}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Xóa
            </button>
          ) : (
            <>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
              >
                OK
              </button>
              <button
                onClick={() => { setMode(null); setSelectedHouses([]); }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Hủy
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bảng */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 hover:shadow-xl">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs">
            <tr>
              {(mode === 'select-edit' || mode === 'delete') && <th className="px-4 py-3">Chọn</th>}
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Ảnh</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Quốc gia</th>
              <th className="px-4 py-3">Địa chỉ</th>
              <th className="px-4 py-3">Giá ($)</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {isAddingInline && (
              <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                <td className="px-4 py-2">1</td>
                <td className="px-4 py-2">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-28 p-1 border dark:border-gray-600 rounded pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                      placeholder=""
                      value={inlineFormData.image}
                      onChange={(e) => setInlineFormData({ ...inlineFormData, image: e.target.value })}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="fileInputAddInline"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setInlineFormData({ ...inlineFormData, image: ev.target.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById("fileInputAddInline").click()}
                      className="absolute right-1 top-1 px-1 text-xs bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                    >
                      Chọn
                    </button>
                    {inlineFormData.image && (
                      <img src={inlineFormData.image} alt="preview" className="mt-1 w-12 h-10 object-cover rounded border" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    className="p-1 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    placeholder=""
                    value={inlineFormData.name}
                    onChange={(e) => setInlineFormData({ ...inlineFormData, name: e.target.value })}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    className="p-1 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    placeholder=""
                    value={inlineFormData.type}
                    onChange={(e) => setInlineFormData({ ...inlineFormData, type: e.target.value })}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    className="p-1 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    placeholder=""
                    value={inlineFormData.country}
                    onChange={(e) => setInlineFormData({ ...inlineFormData, country: e.target.value })}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    className="p-1 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    placeholder=""
                    value={inlineFormData.address}
                    onChange={(e) => setInlineFormData({ ...inlineFormData, address: e.target.value })}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    className="p-1 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 w-24"
                    placeholder=""
                    value={inlineFormData.price}
                    onChange={(e) => setInlineFormData({ ...inlineFormData, price: e.target.value })}
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={handleAddHouse}
                    disabled={loading}
                    className="px-2 py-1 bg-green-500 text-white rounded mr-2 disabled:opacity-50"
                  >
                    {loading ? 'Đang xử lý...' : 'OK'}
                  </button>
                  <button
                    onClick={() => {
                      setInlineFormData({ name: '', type: '', country: '', address: '', price: '', image: '' });
                      setIsAddingInline(false);
                    }}
                    className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500">
                    Hủy
                  </button>
                </td>
              </tr>
            )}

            {filtered.map((item, index) => {
              const isSelected = selectedHouses.some(h => h._id === item._id);
              return (
                <tr
                  key={item._id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${isSelected ? 'bg-purple-100 dark:bg-purple-900/30' : ''}`}
                  onClick={() => (mode === 'select-edit' || mode === 'delete') && toggleSelectHouse(item)}
                >
                  {(mode === 'select-edit' || mode === 'delete') && (
                    <td className="px-4 py-2 text-center">
                      <input type="checkbox" checked={isSelected} readOnly />
                    </td>
                  )}
                  <td className="px-4 py-2">{isAddingInline ? index + 2 : index + 1}</td>
                  <td className="px-4 py-2">
                    <img src={item.image} alt={item.name} className="w-20 h-16 object-cover rounded" />
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">{item.name}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{item.type}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{item.country}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{item.address}</td>
                  <td className="px-4 py-2 text-green-600 dark:text-green-400 font-semibold">{item.price.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {item.status === 'pending' ? (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded-full">
                        Chờ duyệt
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        Đã duyệt
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {item.status === 'pending' && (
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(`http://localhost:5000/api/houses/${item._id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ...item, status: 'approved' })
                            });
                            if (res.ok) {
                              alert('Đã duyệt nhà!');
                              fetchHouses();
                            }
                          } catch (err) {
                            alert('Lỗi: ' + err.message);
                          }
                        }}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded"
                      >
                        Duyệt
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Form Sửa */}
      {mode === 'edit' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <form onSubmit={handleEditSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Sửa Nhà ({editIndex + 1}/{selectedHouses.length})
            </h2>
            <input
              className="w-full mb-2 p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder=""
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input
              className="w-full mb-2 p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder=""
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              required
            />
            <input
              className="w-full mb-2 p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder=""
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              required
            />
            <input
              className="w-full mb-2 p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder=""
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
            <input
              type="number"
              className="w-full mb-2 p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder=""
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />

            <div className="mb-4 relative">
              <input
                type="text"
                className="w-full p-2 border dark:border-gray-600 rounded pr-16 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                placeholder=""
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
              />
              <input
                type="file"
                accept="image/*"
                id="fileInputEdit"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setFormData({...formData, image: ev.target.result});
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById("fileInputEdit").click()}
                className="absolute right-1 top-1 px-2 py-1 text-xs bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Chọn
              </button>
              {formData.image && (
                <img src={formData.image} alt="preview" className="mt-2 w-32 h-24 object-cover rounded border" />
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button type="submit" className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded">OK</button>
              <button type="button" onClick={() => { setMode(null); setSelectedHouses([]); }} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500">Hủy</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
