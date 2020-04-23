import React, { useState, useMemo, useEffect } from 'react';
import {
  format,
  subDays,
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  isBefore,
  parseISO,
  isEqual,
  setMilliseconds,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import pt from 'date-fns/locale/pt';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { Container, Time } from './styles';
import api from '~/services/api';

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,21];
export default function Dashboard() {
  const [schedule, setSchedule] = useState([]);
  const [date, setDate] = useState(new Date());

  const dateFormatted = useMemo(
    () => format(date, "d 'de' MMMM", { locale: pt }),
    [date]
  );
  useEffect(() => {
    async function load() {
      const response = await api.get('/schedule', {
        params: { date },
      });

      const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
      const data = range.map(hour => {
        const checkDate = setMilliseconds(
          setSeconds(setMinutes(setHours(date, hour), 0), 0),
          0
        );
        const compareDate = utcToZonedTime(checkDate, timeZone);

        return {
          time: `${hour}:00h`,
          past: isBefore(checkDate, new Date()),
          appointment: response.data.find(d => {
            return isEqual(parseISO(d.date), compareDate);
          }),
        };
      });
      setSchedule(data);
    }
    load();
  }, [date]);

  function handlePrevDays() {
    setDate(subDays(date, 1));
  }
  function handleNextDays() {
    setDate(addDays(date, 1));
  }
  return (
    <Container>
      <header>
        <button type="button" onClick={handlePrevDays}>
          <MdChevronLeft size={36} color="#fff" />
        </button>
        <strong>{dateFormatted}</strong>
        <button type="button" onClick={handleNextDays}>
          <MdChevronRight size={36} color="#fff" />
        </button>
      </header>
      <ul>
        {schedule.map(time => (
          <Time key={time.time} past={time.past} available={!time.appointment}>
            <strong>{time.time}</strong>
            <span>
              {time.appointment ? time.appointment.user.name : 'Em aberto'}
            </span>
          </Time>
        ))}
      </ul>
    </Container>
  );
}
