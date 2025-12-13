import React, { useMemo, useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

function hhmmToDate(hhmm: string) {
  const [h, m] = hhmm.split(":").map(n => parseInt(n, 10));
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

function dateToHHMM(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

type Props = {
  label: string;
  value: string;              // "HH:MM"
  onChangeValue: (hhmm: string) => void;
  disabled?: boolean;
};

export default function TimePickerField({ label, value, onChangeValue, disabled }: Props) {
  const [open, setOpen] = useState(false);

  const dateValue = useMemo(() => hhmmToDate(value), [value]);

  // Android: показываем системный пикер “всплывашкой”
  if (Platform.OS === "android") {
    return (
      <View style={{ gap: 8, opacity: disabled ? 0.5 : 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{label}</Text>

        <Pressable
          disabled={disabled}
          onPress={() => setOpen(true)}
          style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
        >
          <Text style={{ fontSize: 16 }}>{value}</Text>
        </Pressable>

        {open && (
          <DateTimePicker
            value={dateValue}
            mode="time"
            display="default"
            onChange={(_, selected) => {
              setOpen(false);
              if (selected) onChangeValue(dateToHHMM(selected));
            }}
          />
        )}
      </View>
    );
  }

  // iOS: чаще удобнее показывать модалку с “Готово”
  return (
    <View style={{ gap: 8, opacity: disabled ? 0.5 : 1 }}>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>{label}</Text>

      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      >
        <Text style={{ fontSize: 16 }}>{value}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" }}
          onPress={() => setOpen(false)}
        >
          <Pressable style={{ backgroundColor: "white", padding: 14, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>{label}</Text>
              <Pressable onPress={() => setOpen(false)} style={{ padding: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>Готово</Text>
              </Pressable>
            </View>

            <DateTimePicker
              value={dateValue}
              mode="time"
              display="spinner"
              onChange={(_, selected) => {
                if (selected) onChangeValue(dateToHHMM(selected));
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
