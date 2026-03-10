import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, Trash2, CheckCircle2 } from "lucide-react";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "../api/api";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

import { useNavigate } from "react-router-dom";

const NotificationDropdown = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.No_is_read).length;

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data.data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(notifications.map(n =>
                n.No_id === id ? { ...n, No_is_read: 1 } : n
            ));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(notifications.map(n => ({ ...n, No_is_read: 1 })));
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await deleteNotification(id);
            setNotifications(notifications.filter(n => n.No_id !== id));
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "success": return <CheckCircle className="text-emerald-500" size={18} />;
            case "warning": return <AlertTriangle className="text-amber-500" size={18} />;
            case "error": return <XCircle className="text-red-500" size={18} />;
            default: return <Info className="text-blue-500" size={18} />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-lg transition-all duration-300 ${isOpen ? "bg-primary/10 text-primary" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount > 9 ? "+9" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-black text-slate-800 flex items-center gap-2">
                            الإشعارات
                            <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">
                                {notifications.length}
                            </span>
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-amber-900 transition-colors flex items-center gap-1 shadow-sm"
                            >
                                <CheckCircle2 size={12} />
                                قراءة الكل
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {notifications.map((n) => (
                                    <div
                                        key={n.No_id}
                                        onClick={() => {
                                            if (!n.No_is_read) handleMarkAsRead(n.No_id);
                                            if (n.No_link) {
                                                navigate(n.No_link);
                                                setIsOpen(false);
                                            }
                                        }}
                                        className={`p-4 flex gap-3 transition-colors cursor-pointer group ${!n.No_is_read ? "bg-primary/[0.02]" : "hover:bg-slate-50"
                                            }`}
                                    >
                                        <div className="mt-1 flex-shrink-0">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!n.No_is_read ? "bg-white shadow-sm" : "bg-slate-100"
                                                }`}>
                                                {getIcon(n.No_type)}
                                            </div>
                                        </div>
                                        <div className="flex-1 text-right">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {formatDistanceToNow(new Date(n.No_created_at), { addSuffix: true, locale: ar })}
                                                </span>
                                                {!n.No_is_read && <span className="w-2 h-2 bg-primary rounded-full" />}
                                            </div>
                                            <h4 className={`text-xs font-bold mt-0.5 ${!n.No_is_read ? "text-slate-900" : "text-slate-600"}`}>
                                                {n.No_title}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                                                {n.No_message}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, n.No_id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bell className="text-slate-200" size={32} />
                                </div>
                                <p className="text-sm font-bold text-slate-400">لا توجد إشعارات حالياً</p>
                                <p className="text-xs text-slate-300 mt-1">سنخبرك هنا عند وجود أي تحديثات</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-slate-50/50 border-t border-slate-50 text-center">
                        <button className="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors">
                            عرض المزيد في الإعدادات
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
