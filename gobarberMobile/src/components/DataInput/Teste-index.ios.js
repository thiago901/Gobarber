import React, { useState, useMemo } from 'react';
import { DatePickerIOS } from 'react-native';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons';

import { Container, DateButtom, DateText, Picker } from './styles';

export default function DataInput({ date, onChange }) {
  const dateFormatted = useMemo(
    () => format(date, "dd 'de' MMMM 'de' yyyy ", { locale: pt }),
    [date]
  );

  const [opened, setOpened] = useState(false);
  return (
    <Container>
      <DateButtom onPress={() => setOpened(!opened)}>
        <Icon name="event" size={20} />
        <DateText>{dateFormatted}</DateText>
      </DateButtom>
      {opened && (
        <Picker>
          <DatePickerIOS
            date={date}
            onDateChange={onChange}
            minimumDate={new Date()}
            minuteInterval={60}
            locale="pt"
            mode="date"
          />
        </Picker>
      )}
    </Container>
  );
}
