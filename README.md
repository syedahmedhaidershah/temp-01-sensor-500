# Assumptions and business logics

- **Runtime / Environment:**

  - _The problem specifices a server environment (web server), in a real world scenario I would prefer a Cloud Infrastructure via Serverless resources or Kubernetes and Event Sources. I don't have much proficiency with k8s and their auto-scaling, hence would prefer serverless or server environments and their autoscaling_

  - _Another reason going for server based environment is right now I am not equipped of the performance required and the downscaling applicable. Without KPIs, it is best to launch sensor support for HIGH INGESTION and LOW LATENCY in an responsive environmen that is not prone to cold start times_

- **max sensors**  
_500_

- **max requests / per second**  
_4_

- **min difference between each request batch of 4**  
_0ms, each of the 4 requests can be trigerred on the 0 interval of the first second, or could be evenly spread. the case we are using is the worst case scenario_

- **TTL for cache**  
1 second (1000ms)