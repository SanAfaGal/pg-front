/**
 * Utilidades compartidas para exportación de datos
 */

/**
 * Exporta datos a un archivo CSV
 * @param data - Array de objetos a exportar
 * @param headers - Array de encabezados para el CSV
 * @param getRowData - Función que extrae los datos de cada fila
 * @param filename - Nombre del archivo (sin extensión)
 */
export function exportToCSV<T>(
  data: T[],
  headers: string[],
  getRowData: (item: T) => (string | number)[],
  filename: string = 'export'
): void {
  // Crear contenido CSV
  const csvContent = [
    headers.join(','),
    ...data.map(item => {
      const row = getRowData(item);
      // Escapar comillas y envolver en comillas si contiene comas
      return row.map(cell => {
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',');
    })
  ].join('\n');

  // Crear y descargar archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Limpiar URL
  URL.revokeObjectURL(url);
}

