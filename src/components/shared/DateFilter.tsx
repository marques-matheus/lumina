'use client'

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const getDate = () => {
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    if (from && to) {
      return {
        from: new Date(from),
        to: new Date(to),
      }
    }
    return undefined
  }

  const [date, setDate] = React.useState<DateRange | undefined>(getDate())

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range)
    const params = new URLSearchParams(searchParams)
    if (range?.from) {
      params.set("from", format(range.from, "yyyy-MM-dd"))
    } else {
      params.delete("from")
    }
    if (range?.to) {
      params.set("to", format(range.to, "yyyy-MM-dd"))
    } else {
      params.delete("to")
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} -{" "}
                  {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
