---
layout:       post
title:        "python学习笔记"
subtitle:   "学习汇总"
date:       2025-05-19 
author:       "mkk"
header-style: text
catalog:      true
tags:
    - 笔记
---

# Python基础

## 注释
注释是对代码的解释说明。  
单行注释（行注释）  
Python 中 # 后的一行内的内容会被视为注释   

```
# print("hello world")
print("hello world")  # 打印hello world 
```

多行注释（块注释）
Python 中使用三个引号开始，三个引号结束（单引号或者双引号都可以），为多行注释多行注释在说明文字需要换行时使用，不能嵌套  

```
"""
print("hello world")
print("hello world")
"""
```

## 变量
变量是指在程序执行过程中，其值可以改变的量。在内存的数据区中，会为变量分配存储空间来存放变量的值，这个内存空间的地址对应着变量名称，所以在程序中可以通过变量名称来区分和使用这些内存空间。它的唯一目的是在内存中标记和存储数据,这些数据可以在整个程序中使用。可以将变量理解为一个可以赋给值的标签，也可以说变量指向特定的值。  

### 变量的创建
变量创建方式：变量名 = 变量值   
Python 中的变量不需要声明。每个变量在使用前都必须赋值，变量赋值以后该变量才会被创建。  

```
var1 = 2  # 定义一个变量，变量名为var1，变量值为2 
var2 = 3  # 定义一个变量，变量名为var2，变量值为3
result = var1 + var2  # 定义一个变量，变量名为result，变量值为var1和var2相加的结果 
print(result)  # 打印 result 变量的值 
name = "张三" 
age = 18 
weight = 1000.3 
```

多个变量的创建：  
```
var1 = var2 = var3 = 10  # 多个变量的值相同 
var4, var5, var6 = 10, 20, 30  # 多个变量的值不同
```

