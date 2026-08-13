const DataTable = ({ columns, data, sortField, sortOrder, onSort, emptyMessage = "No records found." }) => {
    const handleSort = (field) => {
        if (!field || !onSort) return;
        if (sortField === field) {
            onSort(field, sortOrder === "asc" ? "desc" : "asc");
        } else {
            onSort(field, "asc");
        }
    };

    const sortIcon = (field) => {
        if (sortField !== field) return "↕";
        return sortOrder === "asc" ? "↑" : "↓";
    };

    return (
        <div className="table-wrap">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={col.sortable ? "sortable" : ""}
                                onClick={() => col.sortable && handleSort(col.key)}
                            >
                                {col.label}
                                {col.sortable && (
                                    <span className="sort-icon">{sortIcon(col.key)}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="empty-cell">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, idx) => (
                            <tr key={row.id ?? idx}>
                                {columns.map((col) => (
                                    <td key={col.key}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
