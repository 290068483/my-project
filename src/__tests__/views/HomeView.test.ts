import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import HomeView from '@/views/HomeView.vue';
import { useUserStore } from '@/stores/user';
import { useHomeStore } from '@/stores/home';

// 模拟 moment
const mockMoment = {
  format: (format: string) => {
    if (format === 'YYYY-MM-DD') return '2023-03-24';
    if (format === 'HH:mm:ss') return '10:30:00';
    if (format === 'dddd') return '星期一';
    return '2023年3月24日';
  }
};

vi.mock('moment', () => ({
  default: vi.fn(() => mockMoment)
}));

// 模拟 console.log
vi.spyOn(console, 'log').mockImplementation(() => {});

describe('HomeView.vue', () => {
  let wrapper: any;
  let userStore: any;
  let homeStore: any;

  beforeEach(() => {
    wrapper = mount(HomeView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                userInfo: {
                  name: '测试用户',
                  department: '技术部',
                  position: '前端工程师',
                  avatar: '测'
                }
              },
              home: {
                notifications: [
                  {
                    id: 1,
                    title: '测试通知',
                    content: '这是一条测试通知',
                    time: '上午9:00',
                    iconColor: 'text-blue-500',
                    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                    type: 'info'
                  }
                ],
                dateData: {
                  date: '2023-03-24',
                  time: '10:30:00',
                  lunarDate: '三月廿四',
                  weekdays: '星期一'
                },
                data1: {
                  data: [
                    { id: 1, name: '待处理任务1', count: 1, details: '任务详情1' },
                    { id: 2, name: '待处理任务2', count: 2, details: '任务详情2' }
                  ]
                },
                data2: {
                  data: [
                    { id: 1, name: '关联任务1', count: 1, details: '关联详情1' },
                    { id: 2, name: '关联任务2', count: 2, details: '关联详情2' }
                  ]
                }
              }
            }
          })
        ]
      }
    });

    userStore = useUserStore();
    homeStore = useHomeStore();
  });

  it('renders user information correctly', () => {
    expect(wrapper.find('.user-info-area').exists()).toBe(true);
    expect(wrapper.find('.user-avatar').text()).toBe('测');
    expect(wrapper.find('.info-value').text()).toBe('测试用户');
  });

  it('displays date and time information', () => {
    expect(wrapper.find('.p-box').text()).toContain('2023-03-24');
    expect(wrapper.find('.p-box .text-red-500').text()).toBe('10:30:00');
    expect(wrapper.find('.p-box').text()).toContain('三月廿四 星期一');
  });

  it('renders notification carousel', () => {
    expect(wrapper.find('.notification-carousel').exists()).toBe(true);
    expect(wrapper.find('.notification-content').text()).toBe('这是一条测试通知');
  });

  it('renders quick info cards', () => {
    const cards = wrapper.findAll('.info-card');
    expect(cards.length).toBe(3);
  });

  it('renders data tables', () => {
    const tables = wrapper.findAll('.table-container');
    expect(tables.length).toBe(2);
  });

  it('calls store actions on component mount', () => {
    expect(userStore.initUserInfo).toHaveBeenCalled();
  });

  it('handles button click', async () => {
    const button = wrapper.find('button');
    await button.trigger('click');
    expect(console.log).toHaveBeenCalledWith('录入新进度按钮被点击');
  });
});