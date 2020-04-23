import React, { useMemo } from 'react';
import { DatePickerAndroid } from 'react-native';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons';

import { Container, DateButtom, DateText } from './styles';

export default function DataInput({ date, onChange }) {
  const dateFormatted = useMemo(
    () => format(date, "dd 'de' MMMM 'de' yyyy ", { locale: pt }),
    [date]
  );

  async function handleOpenPicker() {
    const { action, year, month, day } = await DatePickerAndroid.open({
      mode: 'spinner',
      date,
    });

    if (action === DatePickerAndroid.dateSetAction) {
      const selectedDate = new Date(year, month, day);
      onChange(selectedDate);
    }
  }
  return (
    <Container>
      <DateButtom onPress={handleOpenPicker}>
        <Icon name="event" size={20} />
        <DateText>{dateFormatted}</DateText>
      </DateButtom>
    </Container>
  );
}
