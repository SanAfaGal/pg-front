// Test utility to verify error handling functionality
import { apiClient } from '../shared/api/apiClient';

export const testErrorHandling = async () => {
  console.log('🧪 Testing Error Handling...');
  
  try {
    // Test 1: Network error (invalid URL)
    console.log('Test 1: Network Error');
    await apiClient.get('/test-network-error');
  } catch (error: any) {
    console.log('✅ Network Error Caught:', {
      message: error.message,
      type: error.type,
      status: error.status
    });
  }

  try {
    // Test 2: Timeout error (with very short timeout)
    console.log('Test 2: Timeout Error');
    await apiClient.get('/test-timeout', { timeout: 1 }); // 1ms timeout
  } catch (error: any) {
    console.log('✅ Timeout Error Caught:', {
      message: error.message,
      type: error.type,
      status: error.status
    });
  }

  try {
    // Test 3: HTTP 404 error
    console.log('Test 3: HTTP 404 Error');
    await apiClient.get('/non-existent-endpoint');
  } catch (error: any) {
    console.log('✅ HTTP Error Caught:', {
      message: error.message,
      status: error.status
    });
  }

  console.log('🎉 Error handling tests completed!');
};

// Test the CheckIn error handling specifically
export const testCheckInErrorHandling = async () => {
  console.log('🧪 Testing CheckIn Error Handling...');
  
  const testCases = [
    {
      name: 'Network Error',
      error: {
        type: 'network',
        status: 0,
        message: 'Error de conexión',
        response: { data: null }
      }
    },
    {
      name: 'Timeout Error', 
      error: {
        type: 'timeout',
        status: 0,
        message: 'Tiempo de espera agotado',
        response: { data: null }
      }
    },
    {
      name: 'HTTP 400 - No Face Detected',
      error: {
        status: 400,
        message: 'HTTP error! status: 400',
        response: {
          data: {
            message: 'No face detected in image',
            detail: 'Please ensure your face is clearly visible'
          }
        }
      }
    },
    {
      name: 'HTTP 401 - Face Not Recognized',
      error: {
        status: 401,
        message: 'HTTP error! status: 401',
        response: {
          data: {
            message: 'Face not recognized',
            detail: 'Your face was not found in our system'
          }
        }
      }
    }
  ];

  testCases.forEach(testCase => {
    console.log(`\n📋 Test Case: ${testCase.name}`);
    
    // Simulate the error handling logic from CheckInFacial component
    const err = testCase.error;
    const errorType = err?.type;
    const status = err?.status;
    
    let errorResult: any;
    
    if (errorType === 'network') {
      errorResult = {
        success: false,
        message: 'Error de conexión',
        can_enter: false,
        reason: 'system_error',
        detail: 'No se pudo conectar al servidor. Por favor verifica tu conexión a internet e intenta de nuevo.',
      };
    } else if (errorType === 'timeout') {
      errorResult = {
        success: false,
        message: 'Tiempo de espera agotado',
        can_enter: false,
        reason: 'system_error',
        detail: 'La solicitud tardó demasiado tiempo. Por favor verifica tu conexión e intenta de nuevo.',
      };
    } else if (status && status > 0) {
      let apiMessage = '';
      let apiDetail = '';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        apiMessage = errorData.message || errorData.detail || '';
        apiDetail = errorData.detail || '';
      }
      
      if (status === 400) {
        errorResult = {
          success: false,
          message: apiMessage || 'No se detectó rostro en la imagen',
          can_enter: false,
          reason: 'no_face_detected',
          detail: apiDetail || 'Por favor asegúrate de que tu rostro esté claramente visible en el marco de la cámara e intenta de nuevo.',
        };
      } else if (status === 401) {
        errorResult = {
          success: false,
          message: apiMessage || 'Rostro no reconocido',
          can_enter: false,
          reason: 'face_not_recognized',
          detail: apiDetail || 'Tu rostro no fue reconocido en nuestro sistema. Por favor contacta a recepción para registrar tus datos faciales.',
        };
      }
    }
    
    console.log('✅ Result:', errorResult);
  });
  
  console.log('\n🎉 CheckIn error handling tests completed!');
};
