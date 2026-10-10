import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import {
  getAdminStats,
  verifyUser,
  moderateListing,
  finalizeHandover,
  resolveDispute,
  getReservedListingsQueue,
  handoverListing
} from '../../services/adminService';
import { getFromStorage, STORAGE_KEYS } from '../../services/storage';
import { toast } from '../../store/toastStore';
import {
  Users,
  Building,
  DollarSign,
  FileCheck,
  Check,
  X,
  Lock,
  Unlock,
  Clock,
  ShieldCheck
} from 'lucide-react';
import './AdminDashboard.css';

export const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'listings' | 'reservations' | 'escrow' | 'disputes'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reservedQueue, setReservedQueue] = useState([]);

  // Admin paneli ma'lumotlarini yangilash. Handlers (tugmalar) uchun ham,
  // sahifa ochilgandagi effect uchun ham bir xil manba — lekin har bir
  // chaqiruvchi natijani o'z holatiga o'zi yozadi (effect ichida setState
  // chaqirilishi lint qoidasini buzmasligi uchun).
  const refreshAll = useCallback(async () => {
    const s = await getAdminStats();
    const queue = await getReservedListingsQueue();
    return {
      stats: s,
      users: getFromStorage(STORAGE_KEYS.USERS, []),
      listings: getFromStorage(STORAGE_KEYS.LISTINGS, []),
      requests: getFromStorage(STORAGE_KEYS.REQUESTS, []),
      reservedQueue: queue
    };
  }, []);

  const applyAdminData = useCallback((data) => {
    setStats(data.stats);
    setUsers(data.users);
    setListings(data.listings);
    setRequests(data.requests);
    setReservedQueue(data.reservedQueue || []);
  }, []);

  useEffect(() => {
    let active = true;
    refreshAll().then((data) => {
      if (active) applyAdminData(data);
    });
    return () => { active = false; };
  }, [refreshAll, applyAdminData]);

  const handleVerifyUser = async (userId, status) => {
    try {
      await verifyUser(userId, status);
      toast.success(status === 'VERIFIED' ? 'Foydalanuvchi tasdiqlandi' : 'Rad etildi');
      applyAdminData(await refreshAll());
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleModerateListing = async (listingId, status) => {
    try {
      await moderateListing(listingId, status);
      toast.success(status === 'ACTIVE' ? 'Eʼlon tasdiqlandi va eʼlon qilindi' : 'Eʼlon rad etildi');
      applyAdminData(await refreshAll());
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleFinalizeHandover = async (reqId) => {
    try {
      await finalizeHandover(reqId);
      toast.success('Uyni topshirish tasdiqlandi! Escrow mablagʻi yakunlandi.');
      applyAdminData(await refreshAll());
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleResolveDispute = async (reqId, decision) => {
    try {
      await resolveDispute(reqId, decision, 'Admin tekshiruvi xulosasiga asosan');
      toast.success('Nizo muvaffaqiyatli hal qilindi');
      applyAdminData(await refreshAll());
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleAdminHandover = async (listingId) => {
    try {
      await handoverListing(listingId, 'user_admin');
      toast.success('Uyni topshirish tasdiqlandi! Kontaktlar ochildi va elektron shartnoma avtomatik tuzildi.');
      applyAdminData(await refreshAll());
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="container neo-admin-page">
      <div className="neo-admin-header">
        <h1 className="neo-admin-title">{t('admin.dashboard')}</h1>
        <p className="neo-admin-subtitle">
          JSHSHIR tekshiruvi, eʼlonlar moderatsiyasi, Escrow hamyon va arbitraj nizolari.
        </p>
      </div>

      {/* Stats Cards Row */}
      {stats && (
        <div className="neo-stats-row">
          <Card padding="md" className="neo-stat-card">
            <div className="neo-stat-icon-wrapper" style={{ color: 'var(--primary)' }}>
              <Users size={24} />
            </div>
            <div>
              <small>{t('admin.stat_users')}</small>
              <div className="neo-stat-val">{stats.totalUsers}</div>
              <span className="neo-stat-sub">{stats.pendingUsers} ta tekshiruvda</span>
            </div>
          </Card>

          <Card padding="md" className="neo-stat-card">
            <div className="neo-stat-icon-wrapper" style={{ color: 'var(--info)' }}>
              <Building size={24} />
            </div>
            <div>
              <small>{t('admin.stat_listings')}</small>
              <div className="neo-stat-val">{stats.activeListings}</div>
              <span className="neo-stat-sub">{stats.pendingListings} ta moderatsiyada</span>
            </div>
          </Card>

          <Card padding="md" className="neo-stat-card">
            <div className="neo-stat-icon-wrapper" style={{ color: 'var(--accent)' }}>
              <Lock size={24} />
            </div>
            <div>
              <small>Band qilingan uylar</small>
              <div className="neo-stat-val">{reservedQueue.length}</div>
              <span className="neo-stat-sub">Topshirish navbatida</span>
            </div>
          </Card>

          <Card padding="md" className="neo-stat-card">
            <div className="neo-stat-icon-wrapper" style={{ color: 'var(--warning)' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <small>{t('admin.stat_escrow')}</small>
              <div className="neo-stat-val">${stats.totalEscrowAmount}</div>
              <span className="neo-stat-sub">{stats.escrowLockedCount} ta zayavka muzlatilgan</span>
            </div>
          </Card>

          <Card padding="md" className="neo-stat-card">
            <div className="neo-stat-icon-wrapper" style={{ color: 'var(--success)' }}>
              <FileCheck size={24} />
            </div>
            <div>
              <small>{t('admin.stat_contracts')}</small>
              <div className="neo-stat-val">{stats.activeContracts}</div>
              <span className="neo-stat-sub">{stats.disputesCount} ta nizo</span>
            </div>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div style={{ marginTop: 30, marginBottom: 20 }}>
        <Tabs
          tabs={[
            { id: 'users', label: t('admin.tab_users'), badge: stats?.pendingUsers },
            { id: 'listings', label: t('admin.tab_listings'), badge: stats?.pendingListings },
            { id: 'reservations', label: 'Band qilinganlar (Reservations)', badge: reservedQueue.length },
            { id: 'escrow', label: t('admin.tab_escrow') },
            { id: 'disputes', label: t('admin.tab_disputes'), badge: stats?.disputesCount }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          size="lg"
        />
      </div>

      {/* TAB 1: USERS & PINFL VERIFICATION */}
      {activeTab === 'users' && (
        <Card padding="lg">
          <h3>Foydalanuvchilar va JSHSHIR tekshiruvi</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 16 }}>
            Pasport fotosuratlari va 14 xonali JSHSHIR raqamini tekshirib tasdiqlang.
          </p>

          <div className="neo-table-responsive">
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Foydalanuvchi</th>
                  <th>Telefon</th>
                  <th>JSHSHIR (14 xonali)</th>
                  <th>Holat</th>
                  <th>Hujjat</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.firstName} {u.lastName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rol: {u.role}</div>
                    </td>
                    <td>{u.phone}</td>
                    <td><code>{u.pinfl || 'Kiritilmagan'}</code></td>
                    <td>
                      <Badge
                        variant={u.verificationStatus === 'VERIFIED' ? 'success' : u.verificationStatus === 'PENDING' ? 'warning' : 'neutral'}
                        size="sm"
                      >
                        {u.verificationStatus}
                      </Badge>
                    </td>
                    <td>
                      {u.passportPhoto ? (
                        <a href={u.passportPhoto} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                          Pasport koʻrish
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Yoʻq</span>
                      )}
                    </td>
                    <td>
                      {u.verificationStatus === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Button variant="primary" size="sm" icon={<Check size={14} />} onClick={() => handleVerifyUser(u.id, 'VERIFIED')}>
                            Tasdiqlash
                          </Button>
                          <Button variant="danger" size="sm" icon={<X size={14} />} onClick={() => handleVerifyUser(u.id, 'REJECTED')}>
                            Rad etish
                          </Button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bajarildi</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 2: LISTINGS MODERATION */}
      {activeTab === 'listings' && (
        <Card padding="lg">
          <h3>Eʼlonlar moderatsiyasi</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 16 }}>
            Egalik hujjatlari va xona rasmlarini tekshirib saytga chiqarishni tasdiqlang.
          </p>

          <div className="neo-table-responsive">
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Eʼlon sarlavhasi</th>
                  <th>Turi</th>
                  <th>Narxi</th>
                  <th>Holati</th>
                  <th>Hujjat</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <strong>{l.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.address}</div>
                    </td>
                    <td>{l.type} ({l.rentMode || 'Oddiy'})</td>
                    <td><strong>${l.price}</strong></td>
                    <td>
                      <Badge variant={l.status === 'ACTIVE' ? 'success' : l.status === 'PENDING_MODERATION' ? 'warning' : 'danger'} size="sm">
                        {l.status}
                      </Badge>
                    </td>
                    <td>
                      <span style={{ color: 'var(--info)', fontSize: '0.8rem' }}>kadastr_pdf</span>
                    </td>
                    <td>
                      {l.status === 'PENDING_MODERATION' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Button variant="primary" size="sm" icon={<Check size={14} />} onClick={() => handleModerateListing(l.id, 'ACTIVE')}>
                            Tasdiqlash
                          </Button>
                          <Button variant="danger" size="sm" icon={<X size={14} />} onClick={() => handleModerateListing(l.id, 'REJECTED')}>
                            Rad etish
                          </Button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bajarildi</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB: BAND QILINGANLAR NAVBATI (RESERVATIONS QUEUE) */}
      {activeTab === 'reservations' && (
        <Card padding="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3>Band qilinganlar (Reservations) navbati</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
                $30 Escrow toʻlangan uylar. Admin topshirgach kontaktlar ochiladi va elektron shartnoma generatsiya qilinadi.
              </p>
            </div>
            <Badge variant="accent" size="md">
              {reservedQueue.length} ta navbatda
            </Badge>
          </div>

          {reservedQueue.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
              Ayni paytda band qilingan uylar mavjud emas.
            </div>
          ) : (
            <div className="neo-table-responsive">
              <table className="neo-table">
                <thead>
                  <tr>
                    <th>Uy (Listing)</th>
                    <th>Qidiruvchi (Mijoz)</th>
                    <th>Toʻlov holati</th>
                    <th>Tranzaksiya ID</th>
                    <th>Holat & Muddat</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {reservedQueue.map(({ listing, request, tenant, owner }) => {
                    const is100Paid = request?.isPaymentConfirmed === true;
                    return (
                      <tr key={listing.id}>
                        <td>
                          <strong>{listing.title}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {listing.address || listing.district} · ${listing.price} {listing.type === 'RENT' ? '/ oy' : ''}
                          </div>
                          {owner && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                              Ega: {owner.firstName} {owner.lastName} ({owner.phone})
                            </div>
                          )}
                        </td>
                        <td>
                          {tenant ? (
                            <div>
                              <strong>{tenant.firstName} {tenant.lastName}</strong>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tenant.phone}</div>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>Nomaʼlum</span>
                          )}
                        </td>
                        <td>
                          {is100Paid ? (
                            <Badge variant="success" size="sm" icon={<ShieldCheck size={12} />}>
                              100% Toʻlangan ($30)
                            </Badge>
                          ) : (
                            <Badge variant="warning" size="sm" icon={<Clock size={12} />}>
                              Toʻlov kutilmoqda
                            </Badge>
                          )}
                        </td>
                        <td>
                          <code>{request?.paymentTransactionId || 'TXN-KUTILMOQDA'}</code>
                        </td>
                        <td>
                          <Badge variant={listing.status === 'RESERVED' ? 'accent' : 'info'} size="sm">
                            {listing.status === 'RESERVED' ? 'Band qilingan' : 'Topshirilmoqda'}
                          </Badge>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                            48 soat shartnoma muddati
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Button
                              variant="primary"
                              size="sm"
                              disabled={!is100Paid || listing.status === 'HANDED_OVER'}
                              icon={is100Paid ? <Unlock size={14} /> : <Lock size={14} />}
                              onClick={() => handleAdminHandover(listing.id)}
                              title={!is100Paid ? 'Toʻlov 100% tasdiqlanmaguncha uyni topshirish taqiqlanadi' : 'Kontaktlarni ochish va shartnoma tuzish'}
                            >
                              {listing.status === 'HANDED_OVER' ? 'Topshirilgan' : 'Uyni topshirish'}
                            </Button>
                            {!is100Paid && (
                              <small style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>
                                Toʻlov kutilmoqda
                              </small>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* TAB 3: ESCROW VA HANDOVER (Qoida: 100% to'lov tekshirilgach tugma ochiladi) */}
      {activeTab === 'escrow' && (
        <Card padding="lg">
          <h3>Zayavkalar va Escrow Hamyon Boshqaruvi</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 16 }}>
            <strong>Muhim qoida:</strong> Toʻlov 100% tushmaguncha va ijarachi koʻchib kirishni tasdiqlamaguncha
            "Uyni olib berish / Bitimni yakunlash" amali bloklangan boʻladi!
          </p>

          <div className="neo-table-responsive">
            <table className="neo-table">
              <thead>
                <tr>
                  <th>Zayavka ID</th>
                  <th>Mulk egasi</th>
                  <th>Escrow miqdori</th>
                  <th>Holat</th>
                  <th>Amallar (Uyni topshirish)</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => {
                  const is100PaidAndConfirmed = r.escrowAmount >= 30 && r.status === 'MOVE_IN_CONFIRMED';
                  return (
                    <tr key={r.id}>
                      <td><strong>#{r.id}</strong></td>
                      <td>{r.ownerId}</td>
                      <td>
                        <strong style={{ color: r.escrowAmount > 0 ? 'var(--primary)' : 'inherit' }}>
                          ${r.escrowAmount || 0}
                        </strong>
                      </td>
                      <td>
                        <Badge variant="info" size="sm">{r.status}</Badge>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={!is100PaidAndConfirmed}
                            icon={is100PaidAndConfirmed ? <Unlock size={14} /> : <Lock size={14} />}
                            onClick={() => handleFinalizeHandover(r.id)}
                            title={!is100PaidAndConfirmed ? t('admin.escrow_locked_hint') : ''}
                          >
                            {t('admin.release_escrow')}
                          </Button>
                          {!is100PaidAndConfirmed && (
                            <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                              Bloklangan (shartlar bajarilmagan)
                            </small>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 4: DISPUTES (NIZOLAR) */}
      {activeTab === 'disputes' && (
        <Card padding="lg">
          <h3>Nizolar va Arbitraj</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 16 }}>
            Tomonlar oʻrtasidagi nizolarni koʻrib chiqish va mablagʻni adolatli taqsimlash.
          </p>

          {requests.filter((r) => r.status === 'DISPUTED').length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
              Ayni paytda faol nizolar mavjud emas.
            </div>
          ) : (
            requests
              .filter((r) => r.status === 'DISPUTED')
              .map((d) => (
                <div key={d.id} className="neo-dispute-card">
                  <h4>Nizo zayavkasi #{d.id}</h4>
                  <p>Mablagʻ: ${d.escrowAmount} Escrowda muzlatilgan</p>
                  <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                    <Button variant="primary" size="sm" onClick={() => handleResolveDispute(d.id, 'COMPLETE')}>
                      Ega foydasiga hal qilish
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleResolveDispute(d.id, 'REFUND')}>
                      Ijarachiga pulni qaytarish (Refund)
                    </Button>
                  </div>
                </div>
              ))
          )}
        </Card>
      )}
    </div>
  );
};
