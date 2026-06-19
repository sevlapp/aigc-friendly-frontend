import { Pagination as AntPagination } from 'antd';

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
}

export function Pagination({ current, total, pageSize, onChange }: PaginationProps) {
  return (
    <div style={{ textAlign: 'center', marginTop: 32 }}>
      <AntPagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger
        pageSizeOptions={['5', '10', '20']}
        showTotal={(total) => `共 ${total} 篇文章`}
      />
    </div>
  );
}