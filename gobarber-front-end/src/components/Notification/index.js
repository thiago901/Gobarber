import React, { useState, useEffect, useMemo } from 'react';
import { MdNotifications } from 'react-icons/md';
import { parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '../../services/api';
import {
  Container,
  Badge,
  Notification,
  Scroll,
  NotificationList,
} from './styles';

export default function Notifications() {
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    async function load() {
      const response = await api.get('/notification');

      const data = response.data.map(notifications => ({
        ...notifications,
        timeDistance: formatDistance(
          parseISO(notifications.createdAt),
          new Date(),
          { addSuffix: true, locale: pt }
        ),
      }));
      setNotification(data);
    }

    load();
  }, []);
  const hasUnread = useMemo(() => !!notification.find(n => n.read === false), [
    notification,
  ]);
  function handleToggleVisible() {
    setVisible(!visible);
  }
  async function handleMarkAsRead(id) {
    await api.put(`/notification/${id}`);

    setNotification(
      notification.map(n => (n._id === id ? { ...n, read: true } : n))
    );
  }
  return (
    <Container>
      <Badge hasUnread={hasUnread} onClick={handleToggleVisible}>
        <MdNotifications size={20} color="#7159c1" />
      </Badge>
      <NotificationList visible={visible}>
        <Scroll>
          {notification.map(n => (
            <Notification keu={n._id} unread={!n.read}>
              <p>{n.content}</p>

              <time>{n.timeDistance}</time>
              {!n.read && (
                <button type="button" onClick={() => handleMarkAsRead(n._id)}>
                  Marcar como lida
                </button>
              )}
            </Notification>
          ))}
        </Scroll>
      </NotificationList>
    </Container>
  );
}
