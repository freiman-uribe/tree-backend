export class TimezoneService {
  /**
   * Convierte una fecha a una zona horaria específica
   * @param date Fecha a convertir
   * @param timezone Zona horaria en formato IANA (ej: 'America/New_York', 'Europe/Madrid')
   * @returns Fecha formateada en la zona horaria solicitada
   */
  static convertToTimezone(date: Date, timezone?: string): string {
    if (!timezone) {
      // Sin timezone, devolver en UTC
      return date.toISOString();
    }

    try {
      // Usar Intl.DateTimeFormat para formatear en la zona horaria solicitada
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };

      const formatter = new Intl.DateTimeFormat("en-CA", options);
      const parts = formatter.formatToParts(date);
      
      const year = parts.find((p) => p.type === "year")?.value;
      const month = parts.find((p) => p.type === "month")?.value;
      const day = parts.find((p) => p.type === "day")?.value;
      const hour = parts.find((p) => p.type === "hour")?.value;
      const minute = parts.find((p) => p.type === "minute")?.value;
      const second = parts.find((p) => p.type === "second")?.value;

      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    } catch (error) {
      // Si la zona horaria no es válida, devolver en UTC
      return date.toISOString();
    }
  }

  /**
   * Valida si una zona horaria es válida
   */
  static isValidTimezone(timezone: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
      return true;
    } catch (error) {
      return false;
    }
  }
}
