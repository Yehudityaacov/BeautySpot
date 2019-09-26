import { BusinessModel } from 'src/services/business.service';

export interface IBusinessState {
    businesses: Array<BusinessModel>;
    business: BusinessModel;
};

export const initialBusinessState: IBusinessState = {
    businesses: new Array<BusinessModel>(),
    business: new BusinessModel()
};
