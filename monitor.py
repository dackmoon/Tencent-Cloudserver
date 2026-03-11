#!/usr/bin/env python3
"""服务器资源监控脚本 - 获取 CPU、内存和磁盘使用率"""

import json
import psutil
import requests
from datetime import datetime

# 报警配置 - 请修改为你的接收地址
ALERT_WEBHOOK_URL = "http://your-webhook-url/alert"  # 替换为你的 HTTP 接收地址
CPU_THRESHOLD = 80.0  # CPU 报警阈值 (%)
MEMORY_THRESHOLD = 80.0  # 内存报警阈值 (%)


def get_cpu_usage() -> float:
    """获取 CPU 使用率"""
    return psutil.cpu_percent(interval=1)


def get_memory_usage() -> dict:
    """获取内存使用情况"""
    memory = psutil.virtual_memory()
    return {
        "total_gb": round(memory.total / (1024 ** 3), 2),
        "used_gb": round(memory.used / (1024 ** 3), 2),
        "available_gb": round(memory.available / (1024 ** 3), 2),
        "percent": memory.percent
    }


def get_disk_usage() -> dict:
    """获取磁盘使用情况（根分区）"""
    disk = psutil.disk_usage('/')
    return {
        "total_gb": round(disk.total / (1024 ** 3), 2),
        "used_gb": round(disk.used / (1024 ** 3), 2),
        "free_gb": round(disk.free / (1024 ** 3), 2),
        "percent": disk.percent
    }


def send_alert(alert_type: str, value: float, threshold: float) -> bool:
    """发送飞书卡片格式告警"""
    # 根据严重程度设置颜色模板
    severity = "critical" if value > 90 else "warning"
    template_color = "red" if severity == "critical" else "orange"
    emoji = "🚨" if severity == "critical" else "⚠️"
    
    # 飞书卡片消息格式
    card_message = {
        "msg_type": "interactive",
        "card": {
            "header": {
                "title": {
                    "tag": "plain_text",
                    "content": f"{emoji} 服务器告警"
                },
                "template": template_color
            },
            "elements": [
                {
                    "tag": "div",
                    "text": {
                        "tag": "lark_md",
                        "content": f"**告警类型：** {alert_type}\n**当前值：** {value:.1f}%\n**阈值：** {threshold:.0f}%"
                    }
                },
                {
                    "tag": "hr"
                },
                {
                    "tag": "div",
                    "text": {
                        "tag": "lark_md",
                        "content": f"**严重级别：** {severity.upper()}\n**时间：** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
                    }
                },
                {
                    "tag": "note",
                    "elements": [
                        {
                            "tag": "plain_text",
                            "content": f"{alert_type} 使用率已超过设定阈值，请及时处理！"
                        }
                    ]
                }
            ]
        }
    }
    
    try:
        response = requests.post(
            ALERT_WEBHOOK_URL,
            json=card_message,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        if response.status_code == 200:
            resp_data = response.json()
            if resp_data.get("code") == 0:
                print(f"[ALERT SENT] {alert_type}: {value:.1f}% > {threshold}%")
                return True
            else:
                print(f"[ALERT FAILED] {resp_data.get('msg', 'Unknown error')}")
                return False
        else:
            print(f"[ALERT FAILED] HTTP {response.status_code}: {alert_type} {value:.1f}%")
            return False
    except Exception as e:
        print(f"[ALERT ERROR] Failed to send {alert_type} alert: {e}")
        return False


def main():
    """主函数 - 收集并输出格式化的 JSON 结果，超过阈值时发送报警"""
    cpu_usage = get_cpu_usage()
    memory_info = get_memory_usage()
    disk_info = get_disk_usage()
    
    result = {
        "timestamp": datetime.now().isoformat(),
        "cpu": {
            "usage_percent": cpu_usage
        },
        "memory": memory_info,
        "disk": disk_info
    }

    # 检查 CPU 使用率是否超过阈值
    if cpu_usage > CPU_THRESHOLD:
        send_alert("CPU", cpu_usage, CPU_THRESHOLD)
    
    # 检查内存使用率是否超过阈值
    if memory_info["percent"] > MEMORY_THRESHOLD:
        send_alert("Memory", memory_info["percent"], MEMORY_THRESHOLD)

    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
