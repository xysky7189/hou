<template>
  <div>
    <p>Component</p>
    <div id="main" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'FansIndex',
  data () {
    return {}
  },
  mounted () {
    var myChart = echarts.init(document.getElementById('main'))
    var option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }
    myChart.setOption(option)
  }
}
</script>

<style lang="less" scoped>
</style>
