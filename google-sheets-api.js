// Google Apps Script код для обработки запросов к таблице
function doGet(e) {
  const sheet = SpreadsheetApp.openById('ВАШ_ID_ТАБЛИЦЫ').getSheetByName('Товары');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const products = [];
  
  for (let i = 1; i < data.length; i++) {
    const product = {};
    for (let j = 0; j < headers.length; j++) {
      product[headers[j]] = data[i][j];
    }
    products.push(product);
  }
  
  const response = ContentService.createTextOutput(JSON.stringify(products))
    .setMimeType(ContentService.MimeType.JSON);
    
  return response;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('ВАШ_ID_ТАБЛИЦЫ').getSheetByName('Заказы');
    
    // Сохраняем заказ
    const orderData = [
      new Date(),
      data.order_id,
      JSON.stringify(data.products),
      data.total_price,
      data.customer_name,
      data.customer_phone,
      data.customer_email,
      data.shipping_address,
      data.payment_method,
      'Новый',
      JSON.stringify(data.delivery_info)
    ];
    
    sheet.appendRow(orderData);
    
    // Отправляем в 5post через их API
    const fivepostResponse = sendTo5post(data);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      order_id: data.order_id,
      fivepost_response: fivepostResponse
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendTo5post(orderData) {
  // API ключ 5post
  const API_KEY = 'ВАШ_API_КЛЮЧ_5POST';
  const API_URL = 'https://api.5post.by/order/create';
  
  // Формируем данные для 5post
  const fivepostData = {
    api_key: API_KEY,
    order: {
      external_id: orderData.order_id,
      recipient: {
        name: orderData.customer_name,
        phone: orderData.customer_phone,
        email: orderData.customer_email
      },
      address: {
        city: orderData.shipping_address.city || 'Минск',
        street: orderData.shipping_address.street,
        house: orderData.shipping_address.house,
        apartment: orderData.shipping_address.apartment || ''
      },
      delivery_type: orderData.delivery_type || 'courier',
      payment_type: orderData.payment_method === 'card' ? 'card' : 'cash',
      items: orderData.products.map(product => ({
        name: product.name,
        quantity: product.quantity,
        price: product.price
      })),
      total: orderData.total_price,
      comment: orderData.comment || ''
    }
  };
  
  // Отправляем запрос к 5post API
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(fivepostData)
  };
  
  try {
    const response = UrlFetchApp.fetch(API_URL, options);
    return JSON.parse(response.getContentText());
  } catch (error) {
    return { error: error.toString() };
  }
}
