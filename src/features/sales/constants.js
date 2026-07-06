export const emptySalesOrderForm = {
  customer_name: '',
  phone_number: '',
  email: '',
  address: '',
  company_id_photo: null,
}

export function createEmptySalesOrderForm() {
  return {
    ...emptySalesOrderForm,
  }
}

export function createEmptySalesEmployeeForm() {
  return {
    name: '',
    email: '',
    password: '',
    role: 'employee',
    employeeCode: '',
    phone: '',
  }
}
