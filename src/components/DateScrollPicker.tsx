import { FC, useMemo } from "react";
import { Stack, Typography } from "@mui/material";
import { ScrollPicker } from "./ScrollPicker";
import { range } from "lodash-es";

export type DateScrollPickerProps = {
  /** 日付 */
  value: Date;
  /** 最小日付 */
  minDate?: Date;
  /** 最大日付 */
  maxDate?: Date;
  /**
   * 日付が変更された時
   * @param newValue - 新しい日付
   */
  onChangeValue: (newValue: Date) => void;
};

export const DateScrollPicker: FC<DateScrollPickerProps> = ({
  value,
  onChangeValue,
}) => {
  const { year, month, day } = useMemo(() => {
    return {
      year: value.getFullYear(),
      month: value.getMonth() + 1,
      day: value.getDate(),
    };
  }, [value]);
  const maxDayOfCurrentMonth = useMemo(() => {
    return new Date(year, month, 0).getDate();
  }, [month, year]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <ScrollPicker
        value={year}
        items={range(1900, 2100).map((year) => ({
          value: year,
          label: `${year}`,
        }))}
        onChangeValue={(newYear) => {
          /** 次の年月の最大日数 */
          const maxDayOfNextMonthYear = new Date(newYear, month, 0).getDate();
          onChangeValue(
            new Date(
              newYear,
              month - 1,
              // 最大日数を超えないように調整
              Math.min(day, maxDayOfNextMonthYear)
            )
          );
        }}
      />
      <Typography>年</Typography>
      <ScrollPicker
        value={month}
        items={range(1, 13).map((month) => ({
          value: month,
          label: `${month}`,
        }))}
        onChangeValue={(newMonth) => {
          /** 次の月の最大日数 */
          const maxDayOfNextMonth = new Date(year, newMonth, 0).getDate();
          onChangeValue(
            new Date(
              year,
              newMonth - 1,
              // 最大日数を超えないように調整
              Math.min(day, maxDayOfNextMonth)
            )
          );
        }}
      />
      <Typography>月</Typography>
      <ScrollPicker
        value={day}
        items={range(1, maxDayOfCurrentMonth + 1).map((day) => ({
          value: day,
          label: `${day}`,
        }))}
        onChangeValue={(newDay) => {
          onChangeValue(new Date(year, month - 1, newDay));
        }}
      />
      <Typography>日</Typography>
    </Stack>
  );
};
