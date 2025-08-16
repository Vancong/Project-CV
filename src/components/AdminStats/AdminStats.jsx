import { Card, Row, Col, Statistic, Table, Select, DatePicker } from "antd";
import Chart from "react-apexcharts";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import * as StatsService from "../../services/Stats.Service";
import { getStatusLabel } from "../../utils/orderStatus";

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusColors = {
  completed: "#16a34a",
  refund_pending: "#fbbf24",
  refunded: "#6ee7b7",
  shipping: "#3b82f6",
  pending: "#f59e0b",
  confirmed: "#10b981",
  cancelled: "#ef4444"
};

const AdminStats = () => {
  const [period, setPeriod] = useState("all");
  const [customRange, setCustomRange] = useState([null, null]);
  const user = useSelector(state => state.user);

  const fetchStats = async () => {
    const data = { period };
    if (period === "custom" && customRange[0] && customRange[1]) {
      data.from = customRange[0].format("YYYY-MM-DD");
      data.to = customRange[1].format("YYYY-MM-DD");
    }
    const res = await StatsService.revenue(data, user?.access_token);
    return res.data;
  };

  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats", period, customRange],
    queryFn: fetchStats,
    enabled: period !== "custom" || (!!customRange[0] && !!customRange[1])
  });

  const ordersByStatus = stats?.ordersByStatus || [];
  const series = ordersByStatus.map(item => item.count);
  const labels = ordersByStatus.map(item => getStatusLabel(item.status));
  const colors = ordersByStatus.map(item => statusColors[item.status]);

  const chartOptions = {
    chart: { type: "donut" },
    labels: labels,
    legend: { position: "bottom" },
    colors: colors,
    dataLabels: {
      formatter: (val, opts) => {
        const item = ordersByStatus[opts.seriesIndex];
        return item ? `${item.count} (${item.apiPercent}%)` : "";
      }
    },
  };

  const topColumns = [
    { title: "Sản phẩm", dataIndex: "name", key: "name" },
    { title: "Dung tích", dataIndex: "volume", key: "volume" },
    { title: "Số lượng bán", dataIndex: "totalSold", key: "totalSold" }
  ];

  const lowStockColumns = [
    { title: "Sản phẩm", dataIndex: "name", key: "name" },
    { title: "Dung tích", dataIndex: "volume", key: "volume" },
    { title: "Số lượng còn", dataIndex: "countInStock", key: "countInStock" }
  ];

  const lowStockData = stats?.lowStockProducts?.flatMap(product =>
    product.sizes.map(size => ({
      key: `${product._id}-${size.volume}`,
      name: product.name,
      volume: size.volume,
      countInStock: size.countInStock
    }))
  ) || [];

  return (
    <div>

      <Card style={{ marginBottom: 20 }}>
        <Select value={period} onChange={setPeriod} style={{ width: 200 }}>
          <Option value="all">Tất cả</Option>
          <Option value="today">Hôm nay</Option>
          <Option value="last7">7 ngày gần nhất</Option>
          <Option value="month">Tháng này</Option>
          <Option value="custom">Tùy chỉnh</Option>
        </Select>
        {period === "custom" && (
          <RangePicker
            style={{ marginLeft: 16 }}
            value={customRange}
            onChange={setCustomRange}
          />
        )}
      </Card>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={24} md={12}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card loading={isLoading}>
                <Statistic
                  title="Tổng doanh thu"
                  value={stats?.dailyRevenue?.[0]?.totalPrice || 0}
                  prefix="₫"
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card loading={isLoading}>
                <Statistic
                  title="Số đơn hàng"
                  value={stats?.dailyRevenue?.[0]?.totalOrders || 0}
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card loading={isLoading}>
                <Statistic
                  title="Người dùng mới"
                  value={stats?.users || 0}
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12}>
          {!isLoading && series.length === 0 ? (
              <p>Chưa có dữ liệu thống kê</p>
            ) : (
              <Chart options={chartOptions} series={series} type="donut" width="100%" height={400} />
            )}
        </Col>
      </Row>

      <Card title="Top sản phẩm bán chạy" style={{ marginBottom: 20 }} loading={isLoading}>
        <Table dataSource={stats?.topProducts || []} columns={topColumns} pagination={false} />
      </Card>


      <Card title="Top sản phẩm gần hết hàng" loading={isLoading}>
        <Table dataSource={lowStockData} columns={lowStockColumns} pagination={false} />
      </Card>
    </div>
  );
};

export default AdminStats;
