import { type AccountSetupValues } from '../schemas/account-setup-schema';
import { useAppForm } from './form-context';

export function useAccountSetupForm() {
  return useAppForm({
    defaultValues: {
      step1: { personae: [] as AccountSetupValues['step1']['personae'] },
      step2: { accountType: '' as AccountSetupValues['step2']['accountType'] },
      step3: {
        businessName: '',
        businessEmail: '',
        registrationNumber: '',
        kraPin: '',
        businessType: '' as AccountSetupValues['step3']['businessType'],
        businessAddress: '',
      },
      step4: {
        pickupAddress: '',
        monthlyShipmentVolume:
          '' as AccountSetupValues['step4']['monthlyShipmentVolume'],
        preferredVehicleTypes:
          [] as AccountSetupValues['step4']['preferredVehicleTypes'],
      },
      step5: {
        fleetSize: 0,
        vehicleTypes: [] as AccountSetupValues['step5']['vehicleTypes'],
        licensePlate: '',
        operatingRegions: [] as AccountSetupValues['step5']['operatingRegions'],
      },
      step6: {
        warehouseName: '',
        storageCapacitySqm: 0,
        warehouseLocation: '',
        hasColdStorage: false,
      },
      step7: { accountName: '', phoneNumber: '' },
      step8: {
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        postalCode: '',
      },
    } satisfies AccountSetupValues,
  });
}

export type AccountSetupFormApi = ReturnType<typeof useAccountSetupForm>;
