import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';

export const options = {
  scenarios: {
    carga_progressiva: {
      executor: 'ramping-vus',
      startVUs: 20,
      stages: [
        { duration: '60s', target: 50 },  // Estágio 1: 20 -> 50 VUs em 1 minuto
        { duration: '60s', target: 100 }, // Estágio 2: 50 -> 100 VUs em 1 minuto
        { duration: '60s', target: 0 },   // Estágio 3: 100 -> 0 VUs em 1 minuto
      ],
    },
  },
  thresholds: {
    'http_req_duration{expected_response:true}': [
      'p(90) < 1000',  // 90% das requisições devem responder em até 1s
      'p(95) < 1500',  // 95% das requisições devem responder em até 1.5s
      'p(99) < 2000',  // 99% das requisições devem responder em até 2s
    ],
    'http_req_failed': ['rate<0.01']  // Taxa de erro inferior a 1%
  }
};

export default function () {
  const response = http.get('http://localhost:5000/products');
  
  check(response, {
    'status 200': (r) => r.status === 200,
  });

  sleep(1);  // Intervalo de 1 segundo entre as requisições
}
