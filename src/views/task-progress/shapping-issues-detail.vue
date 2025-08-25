<template>
  <div class="component-shapping-Issues-details">
    <!-- 头部 -->
    <Header />

    <!-- 客户信息 -->
    <div class="customer-info">
      <div class="info-item"><span class="label">客户姓名：</span>陆秦</div>
      <div class="info-item"><span class="label">电话：</span>13800000000</div>
      <div class="info-item"><span class="label">地址：</span>重庆市渝中区三期13-2-28-05</div>
    </div>

    <!-- 表格容器 -->
    <div class="tables-wrapper">
      <!-- 第一个表格：问题列表 -->
      <div class="table-container">
        <h3 class="table-title">问题列表</h3>
        <el-table
          :data="issuesTableData"
          v-loading="loading"
          header-align="center"
          border
          style="border: 1px solid #000">
          <el-table-column prop="id" label="id" width="50" />
          <el-table-column prop="issueNumber" label="问题号" width="80" />
          <el-table-column prop="cabinet" label="柜子" width="100" />
          <el-table-column prop="details" label="问题详情" min-width="150" />
          <el-table-column prop="stage" label="问题环节" width="120" />
          <el-table-column prop="solution" label="处理方法" min-width="150" />
          <el-table-column prop="orderNumber" label="下单号" width="120" />
        </el-table>
      </div>

      <!-- 第二个表格：补件明细 -->
      <div class="table-container">
        <div class="table-header-actions">
          <h3 class="table-title">补件明细</h3>
          <div class="table-actions">
            <DownloadButton @download="exportData" />
            <PrintButton @print="handlePrint" />
          </div>
        </div>
        <el-table
          :data="supplementTableData"
          v-loading="loading"
          header-align="left"
          border
          style="border: 1px solid #000">
          <el-table-column prop="orderNumber" label="下单号" width="120" />
          <el-table-column prop="supplementDetails" label="补件明细" min-width="150" />
          <el-table-column prop="quantity" label="数量" width="80" />
          <el-table-column prop="supplier" label="供货" width="100" />
          <el-table-column prop="status" label="当前状态" width="120" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Header from "@/views/components/header/Header.vue";
import { ElMessage } from "element-plus";
import { ArrowDown, Printer, Download } from "@element-plus/icons-vue";
import DownloadButton from "@/components/DownloadButton/DownloadButton.vue";
import PrintButton from "@/components/PrintButton/PrintButton.vue";

// 导入Excel处理库（需要先安装：npm install xlsx）
// 注意：实际项目中可能需要动态导入，避免增大主包体积

// 问题列表表格数据
const issuesTableData = ref([
  // 初始空数据，确保表格有表头显示
]);
const supplementTableData = ref([
  // 初始空数据，确保表格有表头显示
]);
const loading = ref(true); // 初始状态设为加载中
const customerId = ref("12345"); // 假设这是从路由参数获取的客户ID

// 获取问题列表数据
const fetchIssuesData = async () => {
  if (!customerId.value) {
    ElMessage.warning("缺少客户ID，无法加载数据");
    return;
  }

  loading.value = true;
  console.log("开始加载问题列表数据，客户ID:", customerId.value);

  try {
    // 这里应该调用API获取实际数据，示例中模拟了API调用
    // 实际项目中应替换为真实的API调用
    // const response = await api.get(`/issues?customerId=${customerId.value}`);

    // 模拟API响应数据
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          issueNumber: "QT-2023-001",
          cabinet: "主卧衣柜",
          details: "柜体侧板存在2mm缝隙，需要调整铰链位置",
          stage: "安装环节",
          solution: "重新调整铰链并加固",
          orderNumber: "ORD-2023-1234",
        },
        {
          id: 2,
          issueNumber: "QT-2023-002",
          cabinet: "客厅电视柜",
          details: "抽屉滑轨卡顿，无法顺畅关闭",
          stage: "质检环节",
          solution: "更换滑轨并调试",
          orderNumber: "ORD-2023-1234",
        },
      ];

      console.log("问题列表数据加载完成:", mockData);
      issuesTableData.value = mockData;
      loading.value = false;
    }, 500);
  } catch (error) {
    console.error("获取问题列表失败:", error);
    ElMessage.error("获取问题列表失败");
    loading.value = false;
  }
};

// 获取补件明细数据
const fetchSupplementData = async () => {
  if (!customerId.value) {
    ElMessage.warning("缺少客户ID，无法加载数据");
    return;
  }

  console.log("开始加载补件明细数据，客户ID:", customerId.value);

  try {
    // 这里应该调用API获取实际数据，示例中模拟了API调用
    // 实际项目中应替换为真实的API调用
    // const response = await api.get(`/supplements?customerId=${customerId.value}`);

    // 模拟API响应数据
    setTimeout(() => {
      const mockData = [
        {
          orderNumber: "ORD-2023-1234",
          supplementDetails: "衣柜门板（左侧）",
          quantity: 1,
          supplier: "成都板材厂",
          status: "已发货",
        },
        {
          orderNumber: "ORD-2023-1234",
          supplementDetails: "抽屉滑轨套件",
          quantity: 2,
          supplier: "广州五金配件",
          status: "待发货",
        },
      ];

      console.log("补件明细数据加载完成:", mockData);
      supplementTableData.value = mockData;

      // 只有当两个数据都加载完成后才关闭loading状态
      if (!loading.value || issuesTableData.value.length > 0) {
        loading.value = false;
      }
    }, 700);
  } catch (error) {
    console.error("获取补件明细失败:", error);
    ElMessage.error("获取补件明细失败");
    loading.value = false;
  }
};

// 组件挂载时获取数据
import { onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// 获取URL参数中的客户ID
if (route.query.customerId) {
  customerId.value = route.query.customerId;
}

// 监听路由参数变化，重新加载数据
watch(
  () => route.query.customerId,
  (newCustomerId) => {
    if (newCustomerId) {
      customerId.value = newCustomerId;
      fetchIssuesData();
      fetchSupplementData();
    }
  },
);

onMounted(() => {
  // 确保数据加载
  fetchIssuesData();
  fetchSupplementData();

  // 如果5秒后数据仍未加载，显示错误提示
  setTimeout(() => {
    if (loading.value) {
      loading.value = false;
      ElMessage.warning("数据加载超时，请刷新页面重试");
    }
  }, 5000);
});

// 打印功能
const handlePrint = () => {
  // 检查是否有数据可打印
  if (issuesTableData.value.length === 0 && supplementTableData.value.length === 0) {
    ElMessage.warning("没有数据可以打印");
    return;
  }

  try {
    // 创建打印样式
    const printStyle = document.createElement("style");
    printStyle.textContent = `
      @media print {
        .component-shapping-Issues-details {
          width: 100%;
          margin: 0;
          padding: 0;
          background: white;
          box-shadow: none;
          font-size: 12pt;
        }

        .component-shapping-Issues-details .customer-info {
          page-break-inside: avoid;
          margin-bottom: 20px;
          border-left: 4px solid #333;
          padding: 16px;
          background: #f9f9f9;
        }

        .component-shapping-Issues-details .tables-wrapper {
          display: block;
          margin: 0;
        }

        .component-shapping-Issues-details .table-container {
          width: 100%;
          page-break-inside: avoid;
          margin-bottom: 20px;
          border-radius: 0;
          box-shadow: none;
          padding: 16px;
        }

        .component-shapping-Issues-details .table-header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .component-shapping-Issues-details .table-actions {
          display: none;
        }

        .component-shapping-Issues-details .el-table {
          width: 100% !important;
          border: 1px solid #333;
        }

        .component-shapping-Issues-details .el-table__body-wrapper {
          overflow-x: visible !important;
        }

        .component-shapping-Issues-details .el-table--scrollable-y .el-table__body-wrapper {
          overflow-x: visible !important;
        }

        .component-shapping-Issues-details .el-table--border,
        .component-shapping-Issues-details .el-table--group {
          border: 1px solid #333;
        }

        .component-shapping-Issues-details .el-table th,
        .component-shapping-Issues-details .el-table td {
          border-color: #333;
          padding: 10px;
        }

        .component-shapping-Issues-details .el-table__header th {
          background-color: #f2f2f2;
          color: #333;
          font-weight: 600;
        }

        .component-shapping-Issues-details .info-item {
          margin-bottom: 8px;
        }

        .component-shapping-Issues-details .label {
          color: #333;
          font-weight: 600;
        }

        .component-shapping-Issues-details .table-title {
          color: #333;
          font-size: 16px;
          border-bottom: 2px solid #333;
          margin-bottom: 12px;
        }
      }
    `;

    // 使用appendChild添加样式
    document.head.appendChild(printStyle);

    // 调用打印
    window.print();

    // 监听打印结束事件，移除打印样式
    const afterPrint = () => {
      try {
        document.head.removeChild(printStyle);
      } catch (e) {
        console.warn("移除打印样式时出错:", e);
      }
      window.removeEventListener("afterprint", afterPrint);
    };

    // 添加打印结束事件监听
    window.addEventListener("afterprint", afterPrint);

    // 如果浏览器不支持afterprint事件，5秒后自动移除样式
    setTimeout(() => {
      try {
        if (document.head.contains(printStyle)) {
          document.head.removeChild(printStyle);
        }
      } catch (e) {
        console.warn("移除打印样式时出错:", e);
      }
    }, 5000);
  } catch (error) {
    console.error("打印功能出错:", error);
    ElMessage.error("打印功能出错，请重试");
  }
};

// 数据操作功能
const refreshData = () => {
  ElMessage.info("正在刷新数据...");
  loading.value = true;

  // 同时刷新两个表格数据
  Promise.all([fetchIssuesData(), fetchSupplementData()])
    .then(() => {
      ElMessage.success("数据刷新完成");
    })
    .catch((error) => {
      console.error("数据刷新失败:", error);
      ElMessage.error("数据刷新失败: " + error.message);
    });
};

const exportData = (type: string) => {
  // 检查是否有数据可下载
  if (issuesTableData.value.length === 0 && supplementTableData.value.length === 0) {
    ElMessage.warning("没有数据可以导出");
    return;
  }

  ElMessage.info(`正在准备导出${type.toUpperCase()}格式数据...`);

  // 准备导出数据
  const exportData = {
    customerInfo: {
      name: "陆秦",
      phone: "13800000000",
      address: "重庆市渝中区三期13-2-28-05",
      id: customerId.value,
    },
    issues: issuesTableData.value,
    supplements: supplementTableData.value,
    exportTime: new Date().toISOString(),
  };

  // 根据不同的导出类型执行不同的导出逻辑
  switch (type) {
    case "excel":
      exportToExcel(exportData);
      break;
    case "csv":
      exportToCSV(exportData);
      break;
    case "json":
      exportToJSON(exportData);
      break;
    case "pdf":
      exportToPDF(exportData);
      break;
    default:
      ElMessage.error(`不支持的导出类型: ${type}`);
      return;
  }
};

// 导出为Excel格式
const exportToExcel = (data: any) => {
  try {
    // 创建工作簿
    const workbook = XLSX.utils.book_new();

    // 创建问题数据工作表
    const issuesWs = XLSX.utils.json_to_sheet(data.issues);
    // 创建补件数据工作表
    const supplementsWs = XLSX.utils.json_to_sheet(data.supplements);

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(workbook, issuesWs, "问题列表");
    XLSX.utils.book_append_sheet(workbook, supplementsWs, "补件明细");

    // 生成文件名
    const fileName = `客户问题数据_${data.customerInfo.id}_${new Date().toISOString().slice(0, 10)}.xlsx`;

    // 写入文件并下载
    XLSX.writeFile(workbook, fileName);

    ElMessage.success("Excel格式数据导出完成");
  } catch (error) {
    console.error("导出Excel失败:", error);
    ElMessage.error("导出Excel失败: " + (error as Error).message);
  }
};

// 导出为CSV格式
const exportToCSV = (data: any) => {
  try {
    // 创建问题数据CSV
    const issuesCsv = convertToCSV(data.issues);
    // 创建补件数据CSV
    const supplementsCsv = convertToCSV(data.supplements);

    // 创建一个包含两个工作表的CSV文件
    const combinedCsv = `问题列表\n${issuesCsv}\n\n补件明细\n${supplementsCsv}`;

    // 创建Blob对象
    const blob = new Blob([combinedCsv], { type: "text/csv;charset=utf-8;" });

    // 创建下载链接
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `客户问题数据_${data.customerInfo.id}_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";

    // 添加到文档并触发点击
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    ElMessage.success("CSV格式数据导出完成");
  } catch (error) {
    console.error("导出CSV失败:", error);
    ElMessage.error("导出CSV失败: " + (error as Error).message);
  }
};

// 导出为JSON格式
const exportToJSON = (data: any) => {
  try {
    // 将数据转换为JSON字符串
    const jsonString = JSON.stringify(data, null, 2);

    // 创建Blob对象
    const blob = new Blob([jsonString], {
      type: "application/json;charset=utf-8;",
    });

    // 创建下载链接
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `客户问题数据_${data.customerInfo.id}_${new Date().toISOString().slice(0, 10)}.json`);
    link.style.visibility = "hidden";

    // 添加到文档并触发点击
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    ElMessage.success("JSON格式数据导出完成");
  } catch (error) {
    console.error("导出JSON失败:", error);
    ElMessage.error("导出JSON失败: " + (error as Error).message);
  }
};

// 导出为PDF格式
const exportToPDF = (data: any) => {
  try {
    // 这里可以使用jsPDF库或其他PDF生成库
    // 这里提供一个简化版的实现

    // 创建canvas元素用于生成图片
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // 设置canvas尺寸
    canvas.width = 800;
    canvas.height = 1000;

    // 设置背景色
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 添加标题
      ctx.fillStyle = "black";
      ctx.font = "bold 24px Arial";
      ctx.fillText(`客户问题数据 - ${data.customerInfo.name}`, 20, 40);

      // 添加客户信息
      ctx.font = "16px Arial";
      ctx.fillText(`客户ID: ${data.customerInfo.id}`, 20, 80);
      ctx.fillText(`电话: ${data.customerInfo.phone}`, 20, 110);
      ctx.fillText(`地址: ${data.customerInfo.address}`, 20, 140);

      // 添加问题列表
      ctx.font = "bold 18px Arial";
      ctx.fillText("问题列表", 20, 200);

      ctx.font = "14px Arial";
      let yPos = 230;

      // 添加表头
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(20, yPos, canvas.width - 40, 30);
      ctx.fillStyle = "black";
      ctx.fillText("问题号", 30, yPos + 20);
      ctx.fillText("柜子", 150, yPos + 20);
      ctx.fillText("问题详情", 250, yPos + 20);
      ctx.fillText("问题环节", 450, yPos + 20);

      yPos += 40;

      // 添加问题数据
      data.issues.forEach((issue: any) => {
        ctx.fillText(issue.issueNumber || "", 30, yPos);
        ctx.fillText(issue.cabinet || "", 150, yPos);
        ctx.fillText(issue.details || "", 250, yPos);
        ctx.fillText(issue.stage || "", 450, yPos);
        yPos += 30;
      });

      // 添加补件明细
      yPos += 40;
      ctx.font = "bold 18px Arial";
      ctx.fillText("补件明细", 20, yPos);
      yPos += 30;

      // 添加表头
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(20, yPos, canvas.width - 40, 30);
      ctx.fillStyle = "black";
      ctx.fillText("下单号", 30, yPos + 20);
      ctx.fillText("补件明细", 150, yPos + 20);
      ctx.fillText("数量", 450, yPos + 20);
      ctx.fillText("供货", 550, yPos + 20);

      yPos += 40;

      // 添加补件数据
      data.supplements.forEach((supplement: any) => {
        ctx.fillText(supplement.orderNumber || "", 30, yPos);
        ctx.fillText(supplement.supplementDetails || "", 150, yPos);
        ctx.fillText(supplement.quantity?.toString() || "", 450, yPos);
        ctx.fillText(supplement.supplier || "", 550, yPos);
        yPos += 30;
      });

      // 添加导出时间
      yPos += 40;
      ctx.font = "14px Arial";
      ctx.fillText(`导出时间: ${new Date(data.exportTime).toLocaleString()}`, 20, yPos);
    }

    // 将canvas转换为图片
    canvas.toBlob((blob) => {
      if (blob) {
        // 创建下载链接
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `客户问题数据_${data.customerInfo.id}_${new Date().toISOString().slice(0, 10)}.pdf`,
        );
        link.style.visibility = "hidden";

        // 添加到文档并触发点击
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        ElMessage.success("PDF格式数据导出完成");
      }
    }, "image/png");
  } catch (error) {
    console.error("导出PDF失败:", error);
    ElMessage.error("导出PDF失败: " + (error as Error).message);
  }
};

// 辅助函数：将对象数组转换为CSV字符串
const convertToCSV = (objArray: any[]) => {
  if (objArray.length === 0) return "";

  // 获取表头
  const headers = Object.keys(objArray[0]);

  // 创建CSV内容
  const csvContent = [
    headers.join(","), // 表头
    ...objArray.map((obj) =>
      headers
        .map((header) => {
          // 处理包含逗号或引号的字段
          const value = obj[header] !== undefined ? obj[header].toString() : "";
          return value.includes(",") || value.includes("") ? `"${value.replace(/"/g, "")}"` : value;
        })
        .join(","),
    ),
  ];

  return csvContent.join("\n");
};

// 下载功能 - 保留旧功能兼容性
const handleDownload = (type: string) => {
  // 检查是否有数据可下载
  if (issuesTableData.value.length === 0 && supplementTableData.value.length === 0) {
    ElMessage.warning("没有数据可以下载");
    return;
  }

  if (type === "excel") {
    ElMessage.success("Excel文件正在下载...");
    // 实际项目中这里会调用后端接口或前端生成Excel文件
  } else if (type === "image") {
    ElMessage.success("图片正在下载...");
    // 实际项目中这里会调用截图API或后端生成图片
  }
};
</script>

<style scoped>
/* 客户信息样式 */
.customer-info {
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #409eff;
  position: relative;
  overflow: hidden;
}

.customer-info::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 50%;
  transform: translate(30px, -30px);
}

.info-item {
  display: inline-block;
  margin-right: 28px;
  margin-bottom: 12px;
  font-size: 15px;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 600;
  color: #409eff;
  margin-right: 10px;
  display: inline-block;
  min-width: 80px;
}

/* 表格容器样式 */
.tables-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
  padding: 0 16px;
}

.table-container {
  min-width: 600px;
  flex: 1;
  width: 100%;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.table-container:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.table-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
}

.table-title {
  margin-bottom: 16px;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  position: relative;
  z-index: 1;
}

.table-header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.table-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 表格样式增强 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  font-size: 14px;
  border: none;
  box-shadow: 0 0 0 1px #ebeef5;
}

:deep(.el-table::before) {
  display: none;
}

:deep(.el-table__header-wrapper) {
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

:deep(.el-table__header th) {
  background-color: #f8f9fa;
  color: #303133;
  font-weight: 600;
  padding: 12px 0;
  border-bottom: 2px solid #ebeef5;
  text-align: center;
}

:deep(.el-table__header th) {
  border-right: 1px solid #ebeef5;
}

:deep(.el-table__header th:last-child) {
  border-right: none;
}

:deep(.el-table td) {
  padding: 14px 0;
  border-bottom: 1px solid #ebeef5;
  color: #606266;
  line-height: 1.6;
  vertical-align: middle;
}

:deep(.el-table td) {
  border-right: 1px solid #ebeef5;
}

:deep(.el-table td:last-child) {
  border-right: none;
}

:deep(.el-table__header th:first-child),
:deep(.el-table__body td:first-child) {
  border-left: none;
}

:deep(.el-table__row:hover > td) {
  background-color: #f5f7fa;
}

:deep(.el-table__empty-text) {
  line-height: 3;
  color: #909399;
}

:deep(.el-table--border::after),
:deep(.el-table--group::after) {
  background-color: #ebeef5;
}

:deep(.el-table--border::after) {
  width: 1px;
  right: 0;
  top: 0;
  height: 100%;
}

:deep(.el-table--border::before) {
  height: 1px;
  left: 0;
  bottom: 0;
  width: 100%;
}

/* 状态列特殊样式 */
:deep(.el-table td .cell.status-cell) {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

:deep(.el-table td .cell.status-cell.pending) {
  background-color: #ecf5ff;
  color: #409eff;
}

:deep(.el-table td .cell.status-cell.processing) {
  background-color: #f4f4f5;
  color: #909399;
}

:deep(.el-table td .cell.status-cell.completed) {
  background-color: #f0f9eb;
  color: #67c23a;
}

:deep(.el-table td .cell.status-cell.failed) {
  background-color: #fef0f0;
  color: #f56c6c;
}
</style>
