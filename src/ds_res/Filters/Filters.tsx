import React, { useEffect, useState } from 'react';
import { useServiceItself } from 'bi-internal/services';
import { FiltersService } from '../../services/FiltersService';
import Layout from '../../components/Layout/Layout';
import Checkbox from '../../components/Checkbox/Checkbox';
import './Filters.scss';

const Filters = (props) => {
    const { cfg, subspace, dp } = props;
    const { xs, xAxis } = subspace;

    const filtersService = useServiceItself<FiltersService>(FiltersService);

    const [selectedCustomers, setSelectedCustomers] = useState<string[]>(() => {
        return [...(filtersService.getModel().filters?.[xAxis] || []) as string[]];
    });
   
    const handleChange = (customerId: string) => {
        if (selectedCustomers.includes(customerId)) {
            setSelectedCustomers(selectedCustomers.filter((item) => item !== customerId));
        } else {
            setSelectedCustomers([...selectedCustomers, customerId]);
        }
    }

    useEffect(() => {
      filtersService.setFilters({
            [xAxis]: [...selectedCustomers]
        })
    }, [selectedCustomers]);

    return(
        <Layout>
            <div className='filters'>
                <h4>Заказчики</h4>
                {Array.isArray(xs) && xs.map((item) => {
                    return (
                        <Checkbox
                            key={item.id}
                            checked={selectedCustomers.includes(item.id)}
                            onChange={() => handleChange(item.id)}
                        >
                            {item.title}
                        </Checkbox>
                    )
                })}
            </div>
        </Layout>
    )
}

export default Filters;