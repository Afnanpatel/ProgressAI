export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj =>
        Object.values(obj)
            .map(val => {
                const s = String(val).replace(/"/g, '""');
                return `"${s}"`;
            })
            .join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const exportToPDF = (data, filename, type = 'goals') => {
    if (!data || data.length === 0) return;

    import('jspdf').then(({ jsPDF }) => {
        const doc = new jsPDF();
        const titleMap = {
            goals: 'Progress Report: Goals',
            tasks: 'Project Report: Tasks',
            habits: 'Habit Tracking Report'
        };

        doc.setFontSize(22);
        doc.setTextColor(99, 102, 241); // Primary color
        doc.text(titleMap[type] || 'Progress Report', 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
        doc.line(20, 35, 190, 35);

        let y = 50;
        data.forEach((item, index) => {
            if (y > 260) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(14);
            doc.setTextColor(31, 41, 55);
            doc.setFont('helvetica', 'bold');

            const title = item.title || item.name || `Item ${index + 1}`;
            doc.text(`${index + 1}. ${title}`, 20, y);

            y += 7;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(107, 114, 128);

            if (type === 'goals') {
                doc.text(`Category: ${item.category || 'N/A'}  |  Priority: ${item.priority || 'N/A'}  |  Progress: ${item.progress || 0}%`, 20, y);
                y += 7;
                doc.text(`Target Deadline: ${item.deadline || 'N/A'}`, 20, y);
            } else if (type === 'tasks') {
                doc.text(`Priority: ${item.priority || 'N/A'}  |  Status: ${item.status || 'N/A'}  |  Goal: ${item.goalTitle || 'None'}`, 20, y);
                y += 7;
                doc.text(`Date Created: ${item.date || item.createdAt || 'N/A'}`, 20, y);
            } else if (type === 'habits') {
                doc.text(`Frequency: ${item.frequency || 'N/A'}  |  Consistency: ${item.consistency || 0}%  |  Streak: ${item.streak || 0}`, 20, y);
                y += 7;
                doc.text(`Category: ${item.category || 'N/A'}`, 20, y);
            }

            if (item.description || item.notes) {
                y += 7;
                const desc = item.description || item.notes;
                const splitDesc = doc.splitTextToSize(`Info: ${desc}`, 160);
                doc.text(splitDesc, 20, y);
                y += splitDesc.length * 5;
            }

            y += 10;
        });

        doc.save(filename);
    });
};
