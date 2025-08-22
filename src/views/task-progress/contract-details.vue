<template>
  <div class="contract-container">
    <!-- 操作栏 -->
    <el-card class="mb-4">
      <div class="flex justify-between items-center">
        <div class="text-lg font-semibold">合同详情</div>
        <div class="flex gap-2">
          <el-button type="primary" icon="Download" @click="handleDownload">
            下载合同
          </el-button>
          <el-button type="success" icon="Edit" @click="handleEdit">
            编辑合同
          </el-button>
          <el-button type="warning" icon="Print" @click="handlePrint">
            打印合同
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 合同状态信息 -->
    <el-card class="mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <div class="text-sm text-gray-500">合同编号</div>
          <div class="font-medium">{{ contractInfo.contractNo }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">签订日期</div>
          <div class="font-medium">{{ contractInfo.signDate }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">合同状态</div>
          <el-tag :type="contractInfo.status === '已生效' ? 'success' : 'info'">
            {{ contractInfo.status }}
          </el-tag>
        </div>
        <div>
          <div class="text-sm text-gray-500">有效期至</div>
          <div class="font-medium">{{ contractInfo.expireDate }}</div>
        </div>
      </div>
    </el-card>

    <!-- 合同内容主体 -->
    <el-card class="contract-content">
      <!-- 合同标题 -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold">{{ contractInfo.title }}</h1>
      </div>

      <!-- 合同双方信息 -->
      <div class="grid grid-cols-2 gap-8 mb-8">
        <div class="text-center">
          <div class="text-base font-semibold mb-4">甲方（出租方）</div>
          <div class="text-left ml-16 space-y-2">
            <p>名称：{{ contractInfo.partyA.name }}</p>
            <p>法定代表人：{{ contractInfo.partyA.representative }}</p>
            <p>统一社会信用代码：{{ contractInfo.partyA.creditCode }}</p>
            <p>地址：{{ contractInfo.partyA.address }}</p>
            <p>联系方式：{{ contractInfo.partyA.contact }}</p>
          </div>
        </div>
        <div class="text-center">
          <div class="text-base font-semibold mb-4">乙方（承租方）</div>
          <div class="text-left ml-16 space-y-2">
            <p>名称：{{ contractInfo.partyB.name }}</p>
            <p>法定代表人：{{ contractInfo.partyB.representative }}</p>
            <p>统一社会信用代码：{{ contractInfo.partyB.creditCode }}</p>
            <p>地址：{{ contractInfo.partyB.address }}</p>
            <p>联系方式：{{ contractInfo.partyB.contact }}</p>
          </div>
        </div>
      </div>

      <!-- 合同正文 -->
      <div class="contract-body space-y-6">
        <section v-for="(clause, index) in contractInfo.clauses" :key="index">
          <h2 class="text-lg font-semibold mb-2">
            第 {{ index + 1 }} 条 {{ clause.title }}
          </h2>
          <div class="pl-6 text-indent-8 leading-relaxed">
            <p
              v-for="(para, pIndex) in clause.paragraphs"
              :key="pIndex"
              class="mb-4"
            >
              {{ para }}
            </p>
          </div>
        </section>
      </div>

      <!-- 合同附件 -->
      <div class="mt-10">
        <h2 class="text-lg font-semibold mb-4">合同附件</h2>
        <el-table :data="contractInfo.attachments" border style="width: 100%">
          <el-table-column
            prop="name"
            label="附件名称"
            width="300"
          ></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column prop="size" label="大小"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="text" @click="downloadAttachment(scope.row)">
                <el-icon><Download /></el-icon> 下载
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 签署区域 -->
      <div class="grid grid-cols-2 gap-8 mt-16 text-center">
        <div>
          <div class="mb-8">甲方（盖章）：___________________</div>
          <div>法定代表人/授权代表人（签字）：___________________</div>
          <div class="mt-4">日期：________年____月____日</div>
        </div>
        <div>
          <div class="mb-8">乙方（盖章）：___________________</div>
          <div>法定代表人/授权代表人（签字）：___________________</div>
          <div class="mt-4">日期：________年____月____日</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 合同展示
 *  显示正本
 *  显示附件（报价）
 *      a.报价单 表格编辑，计算，统计，增删改查，打印。
 *  显示注意事项
 *  打印注意事项
 *  a.客户签字，公司签字，业务员签字。
 *
 * 电子合同 签字
 * 合同打印
 */
// 组件逻辑
import { ref } from "vue";
import { Download, Edit, Print } from "@element-plus/icons-vue";

// 合同数据
const contractInfo = ref({
  contractNo: "HT-20230822-001",
  title: "房屋租赁合同",
  signDate: "2023年8月22日",
  status: "已生效",
  expireDate: "2025年8月21日",
  partyA: {
    name: "北京某某房地产有限公司",
    representative: "张三",
    creditCode: "91110101XXXXXXXXXX",
    address: "北京市朝阳区XX街道XX大厦XX层",
    contact: "010-12345678",
  },
  partyB: {
    name: "上海某某科技有限公司",
    representative: "李四",
    creditCode: "91310101XXXXXXXXXX",
    address: "上海市浦东新区XX街道XX大厦XX层",
    contact: "021-87654321",
  },
  clauses: [
    {
      title: "租赁标的",
      paragraphs: [
        "1.1 甲方将其合法拥有的坐落于北京市朝阳区XX路XX号XX大厦XX层XX室（以下简称“该房屋”）出租给乙方使用。",
        "1.2 该房屋建筑面积约为XXX平方米，房屋用途为办公。",
      ],
    },
    {
      title: "租赁期限",
      paragraphs: [
        "2.1 租赁期限为2年，自2023年9月1日起至2025年8月31日止。",
        "2.2 租赁期满，甲方有权收回该房屋，乙方应如期返还。乙方如需继续承租的，应于租赁期满前3个月向甲方提出书面请求，经甲方同意后，双方应重新签订租赁合同。",
      ],
    },
    {
      title: "租金及支付方式",
      paragraphs: [
        "3.1 该房屋每月租金为人民币XX元（大写：XXXXX元整）。",
        "3.2 租金支付方式：按季度支付，乙方应于每季度第一个月的10日前向甲方支付该季度租金。",
        "3.3 甲方指定收款账户：户名：北京某某房地产有限公司，开户行：中国XX银行XX支行，账号：XXXXXXXXXXXXXXXXXXX。",
      ],
    },
  ],
  attachments: [
    {
      name: "房屋产权证明复印件",
      type: "PDF",
      size: "1.2MB",
      url: "/attachments/property.pdf",
    },
    {
      name: "双方营业执照复印件",
      type: "PDF",
      size: "890KB",
      url: "/attachments/license.pdf",
    },
  ],
});

// 下载合同
const handleDownload = () => {
  // 实际项目中调用后端接口下载合同文件
  console.log("下载合同");
};

// 编辑合同
const handleEdit = () => {
  // 跳转到合同编辑页面
  console.log("编辑合同");
};

// 打印合同
const handlePrint = () => {
  window.print();
};

// 下载附件
const downloadAttachment = (file: { name: any }) => {
  console.log("下载附件：", file.name);
};
</script>

<style scoped>
/* 组件样式 */
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
