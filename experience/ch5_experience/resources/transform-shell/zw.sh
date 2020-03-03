#!/usr/bin/env bash



PROCESS=`ps -ef|grep 'zw_model_train'|grep -v grep|grep -v PPID|awk '{ print $2}'`

for i in ${PROCESS}

do

  echo "Kill the zw_model_train process [ $i ]"

  kill -9 ${i}

done



echo 'first param'

echo ${1}

echo 'second param'

echo ${2}

echo 'thrid param'

echo ${3}



python3 zw_model_train.py \

--ps_hosts=localhost:2222 \

--worker_hosts=localhost:2223 \

--job_name=ps \

--task_index=0 \

--itr_step=${1} \

--batch_size=${2} \

--is_sync=True \

--version=${3} &





python3 zw_model_train.py \

--ps_hosts=localhost:2222 \

--worker_hosts=localhost:2223 \

--job_name=worker \

--task_index=0 \

--itr_step=${1} \

--batch_size=${2} \

--is_sync=True \

--version=${3} &